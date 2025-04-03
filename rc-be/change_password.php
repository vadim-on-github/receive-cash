<?php
require_once 'env.php';
require_once 'sendEmail.php';
global $db_host, $db_user, $db_pass, $db_name;
$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
$output = new stdClass();
$output->email_error = false;
if (!$conn) {
  $output->mysql_error = 'Could not Connect MySql Server:' . mysqli_error($conn);
  $output->changed = false;
  echo json_encode($output);
  return;
}
$result = mysqli_query($conn, "SELECT * FROM users WHERE email='{$_POST['uid']}'");
$rows_num = mysqli_num_rows($result);
$user = mysqli_fetch_assoc($result);
if ($rows_num > 0) {
  if ($user['password'] === md5($_POST['currPass'])) {
    $newPass = md5($_POST['newPass']);
    $query = mysqli_query($conn, "UPDATE users SET password='$newPass' WHERE email='{$_POST['uid']}'");
    if ($mysql_error = mysqli_error($conn)) {
      $output->mysql_error = $mysql_error;
      $output->changed = false;
      echo json_encode($output);
      return;
    }
    /*$email_sent = send_email(
      'Password changed - Receive.cash',
      'Your password has been changed',
      $emailAddress
    );
    if ($email_sent !== true) {
      $output->email_error = $email_sent;
      $output->changed = false;
    }*/
    $output->changed = true;
    echo json_encode($output);
    return;
  } else {
    $output->mysql_error = "Current password incorrect";
    $output->changed = false;
    echo json_encode($output);
    return;
  }
} else {
  $output->mysql_error = "Couldn't find the user to change the password for";
  $output->changed = false;
  echo json_encode($output);
  return;
}
