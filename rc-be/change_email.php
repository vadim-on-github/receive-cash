<?php
require_once 'env.php';
require_once 'googleToken.php';
require_once 'sendEmail.php';
global $db_host, $db_user, $db_pass, $db_name;

//database
$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
$output = new stdClass();
$output->changed = false;
if (!$conn) {
  $output->error = 'Could not Connect MySql Server:' . mysqli_error($conn);
  echo json_encode($output);
  return;
}
//✅️

//current email
$currEmailHash = md5($_POST['currEmail']);
if ($currEmailHash !== $_POST['uid']) {
  $output->curr_email_error = 'Wrong current email';
  echo json_encode($output);
  return;
}
$result = mysqli_query($conn, "SELECT * FROM users WHERE email='$currEmailHash'");
if ($mysql_error = mysqli_error($conn)) {
  $output->error = $mysql_error;
  echo json_encode($output);
  return;
}
$rows_num = mysqli_num_rows($result);
$user = mysqli_fetch_assoc($result);
if ($rows_num === 0) {
  $output->curr_email_error = "Couldn't find the current email in the system";
  echo json_encode($output);
  return;
}
//✅️

//new email is different from current?
$newEmailHash = md5($_POST['newEmail']);
if ($currEmailHash === $newEmailHash) {
  $output->new_email_error = 'New email is the same as the old';
  echo json_encode($output);
  return;
}
//✅️

//new email is unique?
$checkIfNewEmailExistsQuery = mysqli_query($conn, "SELECT * FROM users WHERE email='$newEmailHash'");
if ($mysql_error = mysqli_error($conn)) {
  $output->error = $mysql_error;
  echo json_encode($output);
  return;
}
$rows_num = mysqli_num_rows($checkIfNewEmailExistsQuery);
if ($rows_num > 0) {
  $output->new_email_error = 'New email is already registered';
  echo json_encode($output);
  return;
}
//✅️

//password correct?
$password_hash = md5($_POST['password']);
$another_query = mysqli_query($conn, "SELECT * FROM users WHERE email='$currEmailHash' AND password='$password_hash'");
if ($mysql_error = mysqli_error($conn)) {
  $output->error = $mysql_error;
  echo json_encode($output);
  return;
}
$rows_num = mysqli_num_rows($another_query);
if ($rows_num === 0) {
  $output->password_error = 'Wrong password';
  echo json_encode($output);
  return;
}
//✅️

$query = mysqli_query($conn, "UPDATE users SET email='$newEmailHash' WHERE email='$currEmailHash'");
if ($mysql_error = mysqli_error($conn)) {
  $output->error = $mysql_error;
  echo json_encode($output);
  return;
}
$email_sent = send_email(
  'Email changed - Receive.cash',
  "Your account's email address has been changed to " . $_POST['newEmail'],
  $_POST['currEmail']
);
if ($email_sent !== true) {
  $output->error = $email_sent;
}

$output->changed = true;
$output->new_uid = $newEmailHash;
$output->token = create_custom_token($newEmailHash);
$output->tokenForOldUid = create_custom_token($currEmailHash);
echo json_encode($output);
return;
