<?php
require_once 'env.php';
require_once 'googleToken.php';
global $db_host, $db_user, $db_pass, $db_name;

$post_body = file_get_contents("php://input");
$post_data = explode('&', $post_body);
foreach ($post_data as $data) {
  if (strpos($data, 'email=') === 0) {
    $emailHash = urldecode(substr($data, 6));
  } elseif (strpos($data, 'pass=') === 0) {
    $pass = urldecode(substr($data, 5));
  }
}

if (!$emailHash || !$pass) {
  echo 'No email or pass provided';
  return;
}

$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
$output = new stdClass();
if (!$conn) {
  $output->mysql_error = 'Could not Connect MySql Server:' . mysqli_error($conn);
}
$passHash = md5($pass);
$result = mysqli_query($conn, "SELECT * FROM users WHERE email='$emailHash' AND password='$passHash'");
$rows_num = mysqli_num_rows($result);
$user = mysqli_fetch_row($result);
if ($rows_num > 0) {
  $output->pass_correct = true;
  $output->token = create_custom_token($emailHash);
  
} else {
  $output->pass_correct = false;
}
echo json_encode($output);
