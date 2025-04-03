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
  }
}

if (!$email) {
  echo 'No email provided';
  return;
}

require_once 'env.php';
require_once 'sendEmail.php';
global $db_host, $db_user, $db_pass, $db_name;

$output = new stdClass();
$output->email_error = false;


$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

if (!$conn) {
  $output->mysql_error = 'Could not Connect MySql Server:' . mysqli_error($conn);
}

$emailToken = md5($email);
$result = mysqli_query($conn, "SELECT * FROM users WHERE email='$emailToken'");
$rows_num = mysqli_num_rows($result);

function getVerifCode($num_of_chars)
{
  $chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  $codeGood = true;
  
  do {
    $randomStr = '';
    
    for ($i = 0; $i < $num_of_chars; $i++) {
      $index = rand(0, strlen($chars) - 1);
      $randomStr .= $chars[$index];
    }
    
    if (strpos($randomStr, '666') !== false) {
      $codeGood = false;
    } elseif (strpos($randomStr, '999') !== false) {
      $codeGood = false;
    } elseif (strpos($randomStr, '333') !== false) {
      $codeGood = false;
    } elseif (strpos($randomStr, '369') !== false) {
      $codeGood = false;
    } elseif (strpos($randomStr, '396') !== false) {
      $codeGood = false;
    } elseif (strpos($randomStr, '693') !== false) {
      $codeGood = false;
    } elseif (strpos($randomStr, '639') !== false) {
      $codeGood = false;
    } elseif (strpos($randomStr, '963') !== false) {
      $codeGood = false;
    } elseif (strpos($randomStr, '639') !== false) {
      $codeGood = false;
    }
  } while (!$codeGood);
  
  return $randomStr;
}

if ($rows_num === 1) {
  $output->user_found = true;
  $verif_code = getVerifCode(10);
  $query = mysqli_query($conn, "UPDATE users SET pass_reset_code='$verif_code' WHERE email='$emailToken'");
  $output->mysql_error = mysqli_error($conn);
  $email_sent = send_email('Password reset - Receive.cash', 'Enter this code to change your password:<br /><br /><strong>' . $verif_code . '</strong>', $email);
  if ($email_sent !== true) {
    $output->email_error = $email_sent;
    $output->verif_code_email_sent = false;
  } else {
    $output->verif_code_email_sent = true;
  }
} else {
  $output->user_found = false;
  $output->verif_code_email_sent = false;
}

echo json_encode($output);
