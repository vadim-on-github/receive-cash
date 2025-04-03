<?php

use Firebase\JWT\JWT;

require_once 'vendor/autoload.php';

// Get your service account's email address and private key from the JSON key file
$service_account_email = "";
$private_key = "";

function create_custom_token($uid)
{
  global $service_account_email, $private_key;
  
  $now_seconds = time();
  $payload = array(
    "iss" => $service_account_email,
    "sub" => $service_account_email,
    "aud" => "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
    "iat" => $now_seconds,
    "exp" => $now_seconds + (60 * 60),  // Maximum expiration time is one hour
    "uid" => $uid
  );
  
  try {
    return JWT::encode($payload, $private_key, "RS256");
  } catch (Exception $err) {
    return "Token creation error: $err";
  }
}
