<?php
require_once 'env.php';
global $db_host, $db_user, $db_pass, $db_name;
$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
$output = new stdClass();
if (!$conn) {
  $output->error = 'Could not Connect MySql Server:' . mysqli_error($conn);
  echo json_encode($output);
  return;
}

//✅️ database is good

$password_hash = md5($_POST['pass']);
$query = mysqli_query($conn, "SELECT * FROM users WHERE email='{$_POST['emailHash']}' AND password='$password_hash'");
if ($mysql_error = mysqli_error($conn)) {
  $output->error = $mysql_error;
  echo json_encode($output);
  return;
}
$user = mysqli_fetch_assoc($query);
$userCount = mysqli_num_rows($query);
if ($userCount) {
  $query = mysqli_query($conn, "DELETE FROM users WHERE email='{$_POST['emailHash']}' AND password='$password_hash'");
  if ($mysql_error = mysqli_error($conn)) {
    $output->error = $mysql_error;
    echo json_encode($output);
    return;
  }
  
  $output->deleted = true;
} else {
  $output->user_not_found = true;
}

echo json_encode($output);
