<?php
// contact.php — Handles contact and footer forms
// Sends email to site owner using SMTP credentials if available.
// Note: For full SMTP support, install PHPMailer (Composer) or place PHPMailer src files and update the paths below.

// We'll redirect with a status flag; default to plain text only for explicit AJAX requests
if (!(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')) {
    header_remove('Content-Type');
}

// CONFIG
$config = [
    'to_email'    => 'office@hertsroofing.com',
    'smtp' => [
        'host'   => getenv('SMTP_HOST') ?: 'smtp.hertsroofing.com', // TODO: confirm with your provider
        'port'   => getenv('SMTP_PORT') ?: 587,
        'secure' => getenv('SMTP_SECURE') ?: 'tls',
        'user'   => getenv('SMTP_USER') ?: 'no-reply@hertsroofing.com',
        'pass'   => getenv('SMTP_PASS') ?: 'cy00kV7&2',
        'from'   => 'no-reply@hertsroofing.com',
        'from_name' => 'Herts Roofing Website',
    ],
];

function post($key, $default = '') {
    return isset($_POST[$key]) ? trim((string)$_POST[$key]) : $default;
}

function is_valid_email($email) {
    return (bool) filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Identify payload from either Contact page form or Footer form
$source = post('form_source', '');
$name       = post('con_name');
$email      = post('con_email');
$subject    = post('con_subject');
$message    = post('con_message');

// Footer fallback
if (!$email && post('footer_email')) {
    $email   = post('footer_email');
    $name    = post('footer_name'); // optional
    $subject = 'Website footer message';
    $message = post('message');
    $source  = $source ?: 'footer';
}

// Basic validation
$errors = [];
if (!$email || !is_valid_email($email)) {
    $errors[] = 'Please provide a valid email address.';
}
if (!$message) {
    $errors[] = 'Please write a message.';
}
if (!$subject) {
    $subject = 'New enquiry via Herts Roofing website';
}
$name = $name ?: 'Website Visitor';

if ($errors) {
    // Redirect back with error state
    $redirect = post('redirect');
    if (!$redirect) {
        $redirect = $_SERVER['HTTP_REFERER'] ?? 'contact.html';
    }
    $source = $source ?: 'contact';
    $anchor = $source === 'footer' ? '#footer-message' : '#contact-form';
    $sep = (strpos($redirect, '?') === false) ? '?' : '&';
    header('Location: ' . $redirect . $sep . 'status=error' . $anchor, true, 303);
    exit;
}

// Build message
$ip   = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ua   = $_SERVER['HTTP_USER_AGENT'] ?? '';
$time = date('Y-m-d H:i:s');

$bodyHtml = "<html><body style=\"font-family:Arial,Helvetica,sans-serif;\">" .
    "<h2 style=\"margin:0 0 10px\">New message from Herts Roofing website</h2>" .
    "<p style=\"margin:0 0 8px\"><strong>Source:</strong> " . htmlspecialchars($source ?: 'contact') . "</p>" .
    "<p style=\"margin:0 0 8px\"><strong>Name:</strong> " . htmlspecialchars($name) . "</p>" .
    "<p style=\"margin:0 0 8px\"><strong>Email:</strong> " . htmlspecialchars($email) . "</p>" .
    "<p style=\"margin:12px 0 8px\"><strong>Message:</strong><br>" . nl2br(htmlspecialchars($message)) . "</p>" .
    "<hr style=\"margin:16px 0;border:none;border-top:1px solid #eee\">" .
    "<p style=\"color:#999;font-size:12px\">Sent at $time from IP $ip<br>UA: " . htmlspecialchars($ua) . "</p>" .
    "</body></html>";

$bodyText = "New message from Herts Roofing website\n" .
    "Source: " . ($source ?: 'contact') . "\n" .
    "Name: $name\n" .
    "Email: $email\n\n" .
    "Message:\n$message\n\n" .
    "Sent at $time from IP $ip\nUA: $ua\n";

$sent = false;
$sendError = '';

// Try PHPMailer if available (Composer or manual include)
$phpMailerAvailable = false;
try {
    if (file_exists(__DIR__ . '/vendor/autoload.php')) {
        require __DIR__ . '/vendor/autoload.php';
        $phpMailerAvailable = class_exists('PHPMailer\\PHPMailer\\PHPMailer');
    } elseif (file_exists(__DIR__ . '/phpmailer/src/PHPMailer.php')) {
        // Legacy folder structure: phpmailer/src
        require __DIR__ . '/phpmailer/src/PHPMailer.php';
        require __DIR__ . '/phpmailer/src/SMTP.php';
        require __DIR__ . '/phpmailer/src/Exception.php';
        $phpMailerAvailable = class_exists('PHPMailer\\PHPMailer\\PHPMailer');
    } elseif (file_exists(__DIR__ . '/phpmailer-7.0.0/src/PHPMailer.php')) {
        // Provided folder structure: phpmailer-7.0.0/src
        require __DIR__ . '/phpmailer-7.0.0/src/PHPMailer.php';
        require __DIR__ . '/phpmailer-7.0.0/src/SMTP.php';
        require __DIR__ . '/phpmailer-7.0.0/src/Exception.php';
        $phpMailerAvailable = class_exists('PHPMailer\\PHPMailer\\PHPMailer');
    }
} catch (Throwable $e) {
    $phpMailerAvailable = false;
}

if ($phpMailerAvailable) {
    try {
        $mailerClass = '\\PHPMailer\\PHPMailer\\PHPMailer';
        $mail = new $mailerClass(true);
        $mail->isSMTP();
        $mail->Host       = $config['smtp']['host'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $config['smtp']['user'];
        $mail->Password   = $config['smtp']['pass'];
        $mail->SMTPSecure = $config['smtp']['secure'];
        $mail->Port       = (int)$config['smtp']['port'];
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom($config['smtp']['from'], $config['smtp']['from_name']);
        $mail->addAddress($config['to_email']);
        // Reply to the sender
        if (is_valid_email($email)) {
            $mail->addReplyTo($email, $name);
        }

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $bodyHtml;
        $mail->AltBody = $bodyText;

        $sent = $mail->send();
    } catch (Throwable $e) {
        $sendError = 'Mailer error: ' . $e->getMessage();
        $sent = false;
    }
}

// Fallback: PHP mail()
if (!$sent) {
    $headers = [];
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=UTF-8';
    $headers[] = 'From: ' . $config['smtp']['from_name'] . ' <' . $config['smtp']['from'] . '>';
    if (is_valid_email($email)) {
        $headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
    }
    $headers[] = 'X-Mailer: PHP/' . phpversion();

    $sent = @mail($config['to_email'], $subject, $bodyHtml, implode("\r\n", $headers));
}

// Build redirect URL
$redirect = post('redirect');
if (!$redirect) {
    $redirect = $_SERVER['HTTP_REFERER'] ?? 'contact.html';
}
$source = $source ?: 'contact';
$anchor = $source === 'footer' ? '#footer-message' : '#contact-form';
$sep = (strpos($redirect, '?') === false) ? '?' : '&';

if ($sent) {
    header('Location: ' . $redirect . $sep . 'status=success' . $anchor, true, 303);
    exit;
} else {
    header('Location: ' . $redirect . $sep . 'status=error' . $anchor, true, 303);
    exit;
}
