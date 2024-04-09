

<?php
$to = "psuthar27302@gmail.com"; // Your email address
$from = $_POST['email']; // Sender's email address
$sender_name = $_POST['name'];
$phone = $_POST['phone'];
$address = $_POST['address'];
$note = $_POST['note'];

$subject = "Form submission";
$message = $sender_name . " has sent the contact message! Their phone number is: " . $phone . ", and their address is: " . $address . ". They wrote the following: " . "\n\n" . $note;

$headers = 'From: ' . $from;
mail($to, $subject, $message, $headers);
?>
