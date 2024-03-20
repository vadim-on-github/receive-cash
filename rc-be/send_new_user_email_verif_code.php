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

$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

if (!$conn) {
    $output->mysql_error = 'Could not Connect MySql Server:' . mysqli_error($conn);
}

$email_hash = md5($email);
$result = mysqli_query($conn, "SELECT * FROM users WHERE email='$email_hash'");
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

$verif_code = getVerifCode(5);

if ($rows_num === 0) {
    $query = mysqli_query($conn, "INSERT INTO users(email, verif_code) VALUES('$email_hash', '$verif_code')");
    if ($mysql_error = mysqli_error($conn)) {
        $output->mysql_error = $mysql_error;
    } else {
        $output->user_created = true;
        $email_sent = send_email('Email verification - Receive.cash', 'Enter this code during registration:<br /><br /><strong>' . $verif_code . '</strong>', $email);
        if ($email_sent) {
            $output->email_sent = true;
        } else {
            $output->email_error = $email_sent;
        }
    }
} else {
    $user = mysqli_fetch_assoc($result);
    $output->password_set = $user['password'] !== null;

    if (!$output->password_set) {
        $query = mysqli_query($conn, "UPDATE users SET verif_code='$verif_code' WHERE email='$email_hash'");
        if ($mysql_error = mysqli_error($conn)) {
            $output->mysql_error = $mysql_error;
        } else {
            $output->user_already_present = true;
        }

        $email_sent = send_email('Email verification - Receive.cash', 'Enter this code during registration:<br /><br /><strong>' . $verif_code . '</strong>', $email);
        if ($email_sent) {
            $output->email_sent = true;
        } else {
            $output->email_error = $email_sent;
        }
    }
}

$output->registered = true;

echo json_encode($output);
