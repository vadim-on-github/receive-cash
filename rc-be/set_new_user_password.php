<?php
require_once 'env.php';
require_once 'sendEmail.php';
require_once 'googleToken.php';
global $db_host, $db_user, $db_pass, $db_name;

$email = $_POST['email'];
$password = $_POST['pass'];

if (!$email || !$password) {
    echo 'No email or password provided';
    return;
}

$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
$output = new stdClass();
if (!$conn) {
    $output->mysql_error = 'Could not Connect MySql Server:' . mysqli_error($conn);
}
$emailHash = md5($email);
$passHash = md5($password);
$result = mysqli_query($conn, "SELECT * FROM users WHERE email='$emailHash'");
$rows_num = mysqli_num_rows($result);
$user = mysqli_fetch_assoc($result);
if ($rows_num > 0) {
    $output->verified = true;
    $query = mysqli_query($conn, "UPDATE users SET password='$passHash' WHERE email='$emailHash'");
    if ($mysql_error = mysqli_error($conn)) {
        $output->mysql_error = $mysql_error;
    } else {
        $output->password_set = true;
        $output->uid = $emailHash;
        $output->firebase_token = create_custom_token($emailHash);
        $email_sent = send_email(
            'Account created - Receive.cash',
            'Thank you for creating an account! Enjoy receiving cash!',
            $email);
        if ($email_sent !== true) {
            $output->email_error = $email_sent;
        }
    }
} else {
    $output->user_not_found = true;
}

echo json_encode($output);
