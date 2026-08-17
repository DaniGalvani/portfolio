<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Content-Type: application/json; charset=utf-8');

// The recipient can be an external mailbox. The sender, however, must belong
// to the domain hosted by webgo so that the local mail server accepts it.
$recipientEmail = 'dfelizetti@gmx.de';
$senderEmail = 'dfelizetti@daniel-felizetti.de';

function respond(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

$requestMethod = $_SERVER['REQUEST_METHOD'] ?? '';

if ($requestMethod === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($requestMethod !== 'POST') {
    header('Allow: POST, OPTIONS');
    respond(405, ['success' => false, 'error' => 'Method not allowed']);
}

$contentType = strtolower($_SERVER['CONTENT_TYPE'] ?? '');

if (strpos($contentType, 'application/json') !== false) {
    $requestBody = file_get_contents('php://input');
    $params = json_decode($requestBody ?: '', true);

    if (!is_array($params) || json_last_error() !== JSON_ERROR_NONE) {
        respond(400, ['success' => false, 'error' => 'Invalid JSON']);
    }
} else {
    // Keep the endpoint usable when JavaScript is unavailable.
    $params = $_POST;
}

$name = trim((string) ($params['name'] ?? ''));
$email = trim((string) ($params['email'] ?? ''));
$userMessage = trim((string) ($params['message'] ?? ''));
$privacyAccepted = filter_var(
    $params['privacyAccepted'] ?? $params['privacy-policy-accepted'] ?? false,
    FILTER_VALIDATE_BOOLEAN
);

if (
    $name === ''
    || $userMessage === ''
    || !$privacyAccepted
    || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || preg_match('/[\r\n]/', $email)
) {
    respond(400, ['success' => false, 'error' => 'Invalid input data']);
}

// Avoid unexpectedly large messages reaching the local mail service.
if (strlen($name) > 200 || strlen($email) > 254 || strlen($userMessage) > 10000) {
    respond(400, ['success' => false, 'error' => 'Input data is too long']);
}

$safeName = htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeEmail = htmlspecialchars($email, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeMessage = nl2br(
    htmlspecialchars($userMessage, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')
);

$subject = 'Website Contact Form';
$mailBody = <<<HTML
<strong>Name:</strong> {$safeName}<br>
<strong>Email:</strong> {$safeEmail}<br><br>
<strong>Message:</strong><br>
{$safeMessage}
HTML;

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: Website Contact <' . $senderEmail . '>',
    'Reply-To: ' . $email,
];

if (!function_exists('mail')) {
    respond(503, ['success' => false, 'error' => 'Mail service unavailable']);
}

// Keep the envelope sender aligned with the hosted domain. If the hosting
// account supplies its own default envelope sender, retry without overriding it.
$success = mail(
    $recipientEmail,
    $subject,
    $mailBody,
    implode(chr(13) . chr(10), $headers),
    '-f' . $senderEmail
);

if (!$success) {
    $success = mail(
        $recipientEmail,
        $subject,
        $mailBody,
        implode(chr(13) . chr(10), $headers)
    );
}

if (!$success) {
    respond(500, ['success' => false, 'error' => 'Mail delivery failed']);
}

respond(200, ['success' => true]);
