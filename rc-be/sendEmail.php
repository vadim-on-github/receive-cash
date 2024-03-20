<?php

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

//use PHPMailer\PHPMailer\SMTP;

require 'vendor/phpmailer/phpmailer/src/Exception.php';
require 'vendor/phpmailer/phpmailer/src/PHPMailer.php';
//If you're not using the SMTP class explicitly (you're probably not), you don't need a use line for the SMTP class
//require 'vendor/phpmailer/phpmailer/src/SMTP.php';
require 'vendor/autoload.php';
require 'env.php';


function send_email($subject, $message, $to)
{
  global $emailHost, $emailUser, $emailPass, $siteName, $emailReplyToAddr, $emailReplyToName;
  
  $mail = new PHPMailer(true);
  try {
    //Server settings
    //    $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host = $emailHost;                     //Set the SMTP server to send through
    $mail->SMTPAuth = true;                                   //Enable SMTP authentication
    $mail->Username = $emailUser;                     //SMTP username
    $mail->Password = $emailPass;                               //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
    $mail->Port = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
    $mail->setFrom($emailUser, $siteName);
    $mail->addAddress($to);     //Add a recipient
    $mail->addReplyTo($emailReplyToAddr, $emailReplyToName);
//  $mail->addCC('cc@example.com');
//  $mail->addBCC('bcc@example.com');

//Attachments
//  $mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
//  $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

//Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = $subject;
    $mail->Body = $message;
    $mail->AltBody = strip_tags($message);
    
    $mail->send();
    return true;
  } catch (Exception $e) {
    return $mail->ErrorInfo;
  }
}
