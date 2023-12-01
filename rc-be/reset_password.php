<?php
header('Content-Type: application/json');
//header('Access-Control-Allow-Origin: https://receive.cash');
//header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
//header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept');

ini_set("display_errors", "1");
error_reporting(E_ALL);
$post_body = file_get_contents("php://input");
$post_data = explode('&', $post_body);

foreach ($post_data as $data) {
  if (strpos($data, 'email=') === 0) {
    $email = urldecode(substr($data, 6));
  } elseif (strpos($data, 'verifCode=') === 0) {
    $verif_code = urldecode(substr($data, 10));
  } elseif (strpos($data, 'newPass=') === 0) {
    $newPass = urldecode(substr($data, 8));
  }
}

if (!isset($email)) {
  echo 'No email provided';
}
if (!isset($verif_code)) {
  echo 'No verification code provided';
}
if (!isset($newPass)) {
  echo 'No password provided';
}
if (!isset($email) || !isset($verif_code) || !isset($newPass)) {
  return;
}

require_once 'env.php';
require_once 'sendEmail.php';
global $db_host, $db_user, $db_pass, $db_name;

$output = new stdClass();


$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

if (!$conn) {
  $output->mysql_error = 'Could not Connect MySql Server:' . mysqli_error($conn);
}

$emailToken = md5($email);
$result = mysqli_query($conn, "SELECT * FROM users WHERE email='$emailToken'");
$rows_num = mysqli_num_rows($result);

if ($rows_num === 1) {
  $output->user_found = true;
  $user = mysqli_fetch_assoc($result);
  if ($user['pass_reset_code'] === $verif_code) {
    $output->verif_code_correct = true;
    $pass_token = md5($newPass);
    $result = mysqli_query($conn, "UPDATE users SET password='$pass_token' WHERE email='$emailToken'");
    if ($mysql_error = mysqli_error($conn)) {
      $output->mysql_error = $mysql_error;
      $output->password_reset = false;
    } else {
      $output->password_reset = true;
    }
  } else {
    $output->verif_code_correct = false;
  }
} else {
  $output->user_found = false;
}

echo json_encode($output);
