<?php

use Firebase\JWT\JWT;

require_once 'vendor/autoload.php';

// Get your service account's email address and private key from the JSON key file
$service_account_email = "firebase-adminsdk-k7h3l@receive-cash-vh.iam.gserviceaccount.com";
$private_key = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC4l9m84G0J9h/n\neSLVMxEtHPxOxMtyi0RVm+g3WFnQHvG56sFqD4gkaSS65+MmzdVvw31/YX+Hx2PU\nKP3Kd4Mhg3j++NXJyoNRoFoP2t3AdCWKw/4WKnozZxHe9hNFw7bMTmtYXLqj5jWY\nOB5Aqkbl42VhWCq5HlW/7Vy2u0eQBYTEjL2wKD+/AactsCgG/SQp330jYHPb/g7d\nweALc0uyrr3egeN6YMy7E+4fJ4lelqjxDsw7F4gLFm5um6D+hiFaTDSl1EI8trNd\nwkrBCubCpKowRS9ZUj+5a52arjaKyJjhJMD+Owk4Q2gYZHeUjH0+N8klgveu4O4w\nXd5H2dK5AgMBAAECggEABaMagsR6Q/l8ki+udwMNGVr3IAstuNjkrHYbRnRn4r2N\nLXusLipdApqk5OHPu6fBxrzaNGWEdN+rjmc1j+UsL53xmBy+f5/z+G5Mjcsl5jqN\nynHvjJr9uhvhzXSnlEP0rULQT6WeTALL3HMLRneEvIDAH/PGszpITVkI8aogtnbN\nT4PpMWN6ZVUlJbxZzJtVfHs3kq0jauKnfpUPlUt06jeAWBzoAXwDFfrYfE7LXJCR\nOnknAzXu6QUUTVo3xHuSC8ygt01Sitpq9TeVHl2kAIzUfCfslvlwjcSt2H6lJ6m3\n1ViDwwefssu239oeuKKcyVBSfQwxGyTQ/LX9RaATMQKBgQD0h1TTcij/GLxc2F3E\n9gUnWSDlhHQyBj9R5nfo7MINJo8eQq7iM4bsLkJ4MWpuUciHHiTAmaEb6mr5325o\nm5UdS1QHj9Q1u089Tdttsyi0VYV597EU63gckfsgJ/aN3BLFCqtaqrqiocOKT2rG\nuivBz16eKzyeQ/ipW1igY1hEaQKBgQDBQLlBZFU0fXYjq859Os+WYaiqFfMzTEMs\nqrn6p+vA1ehTX92K5GN0HRiFLbT2KliTTwUqI6bq5PvvTLUxAYJaLQnbpZvJIydu\n8hvvn8QfX/v9+CeJ1maEZ5LR4TwPjF26gMbOAlsiFdTDH3XqgjxZ6NSezXuGamvr\n7gOpOmcR0QKBgQDOybtkbQBaahKw+ZCixeKp2efF8PNKcpoNqrbw1XdtI5SYZI/8\nXtLU3HH9rtxwmtzX1xgBgGoMb3s0AE0gTaIWeeN/2ZP+NH7YOwU7iez8Q+5yrJKm\nPFMA5jrWgLUyVk/RLiqmrAbVDbONPYfwsvPaHIHJhIro1FZu8f7K8/hrMQKBgGun\nPovq9HwVF+avIowoYtOG+4okSCJfbVxIjunO+Umm35Dyalug9rYML0ihOZmX5VfK\nQTpEOgvIG4Am3xi5mn/ZbxBopOvbJXBsdpt6CKrhsWK9BmmGgf1oJSW9rtOKgfwP\nGLBSJ6pJNwirUeidPDlptmfwV8t9JTl8kZWH7zrBAoGACF2zb7vmZzWoTLtE98Af\nPkgJ8rYM6Novtxz7XzMGN797iZRmMTEEklFmMnEE9JpF3NBLt33+MnUBCRE4ggLM\nLWRE+sGe3k+spNAJEHkwaIt0dJEDyik+IHjOuoOOAvpt7hKSjIb/Fv8gA85z9plr\nor/GSSXG27el5G4u6vuXUgw=\n-----END PRIVATE KEY-----\n";

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
