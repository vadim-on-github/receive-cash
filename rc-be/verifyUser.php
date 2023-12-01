<?php
require_once 'env.php';
require_once 'sendEmail.php';
require_once 'googleToken.php';
global $db_host, $db_user, $db_pass, $db_name;
$output = new stdClass();
$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

if (!$conn) {
    $output->mysql_error = 'Could not Connect MySql Server:' . mysqli_error($conn);
}

$email = $_POST['email'];
$verifCodeProvided = $_POST['verifCode'];

if (!$email || !$verifCodeProvided) {
    echo 'No email or verification code provided';
    return;
}

$emailHash = md5($email);
$result = mysqli_query($conn, "SELECT * FROM users WHERE email='$emailHash'");
$rows_num = mysqli_num_rows($result);
$user = mysqli_fetch_assoc($result);
$verifCodeStored = $user['verif_code'];
if ($rows_num > 0) {
    if ($verifCodeStored === $verifCodeProvided) {
        $output->verified = true;
    } else {
        $output->verified = false;
        $output->verif_error = 'Wrong code';
    }
} else {
    $output->cannot_find_user_to_verify = true;
}

echo json_encode($output);
