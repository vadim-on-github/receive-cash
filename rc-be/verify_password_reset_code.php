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
  }
}

if (!isset($email) && !isset($verif_code)) {
  echo 'Email and verification code not provided';
  return;
} elseif (!isset($email)) {
  echo 'No email provided';
  return;
} elseif (!isset($verif_code)) {
  echo 'No verification code provided';
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
  } else {
    $output->verif_code_correct = false;
  }
} else {
  $output->user_found = false;
}

echo json_encode($output);
