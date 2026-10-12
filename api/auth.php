<?php

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store");

const REMEMBER_COOKIE_NAME = "jmali_remember";
const REMEMBER_COOKIE_LIFETIME = 60 * 60 * 24 * 400;

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function setCustomerSessionCookie(int $expires, bool $secure): void
{
    setcookie(session_name(), session_id(), [
        "expires" => $expires,
        "path" => "/",
        "secure" => $secure,
        "httponly" => true,
        "samesite" => "Lax"
    ]);
}

function setRememberCookie(string $token, int $expires, bool $secure): void
{
    setcookie(REMEMBER_COOKIE_NAME, $token, [
        "expires" => $expires,
        "path" => "/",
        "secure" => $secure,
        "httponly" => true,
        "samesite" => "Lax"
    ]);
}

function getRememberToken(): ?string
{
    $token = $_COOKIE[REMEMBER_COOKIE_NAME] ?? "";
    return preg_match("/\\A[a-f0-9]{64}\\z/i", $token) ? $token : null;
}

function clearRememberedDevice(PDO $pdo, bool $secure): void
{
    $token = getRememberToken();
    if ($token !== null) {
        $statement = $pdo->prepare("DELETE FROM customer_remember_tokens WHERE token_hash = :token_hash");
        $statement->execute(["token_hash" => hash("sha256", $token)]);
    }
    setRememberCookie("", time() - 42000, $secure);
}

function createRememberedDevice(PDO $pdo, int $customerId, bool $secure): void
{
    $token = bin2hex(random_bytes(32));
    $statement = $pdo->prepare("
        INSERT INTO customer_remember_tokens (customer_id, token_hash)
        VALUES (:customer_id, :token_hash)
    ");
    $statement->execute([
        "customer_id" => $customerId,
        "token_hash" => hash("sha256", $token)
    ]);
    setRememberCookie($token, time() + REMEMBER_COOKIE_LIFETIME, $secure);
}

function restoreRememberedCustomer(PDO $pdo, bool $secure): ?array
{
    $token = getRememberToken();
    if ($token === null) {
        return null;
    }

    $tokenHash = hash("sha256", $token);
    $statement = $pdo->prepare("
        SELECT accounts.id, accounts.full_name, accounts.email, accounts.account_type
        FROM customer_remember_tokens AS tokens
        JOIN customer_accounts AS accounts ON accounts.id = tokens.customer_id
        WHERE tokens.token_hash = :token_hash
        LIMIT 1
    ");
    $statement->execute(["token_hash" => $tokenHash]);
    $customer = $statement->fetch();
    if (!$customer) {
        setRememberCookie("", time() - 42000, $secure);
        return null;
    }

    $customer["id"] = (int) $customer["id"];
    $update = $pdo->prepare("
        UPDATE customer_remember_tokens
        SET last_used_at = CURRENT_TIMESTAMP
        WHERE token_hash = :token_hash
    ");
    $update->execute(["token_hash" => $tokenHash]);
    session_regenerate_id(true);
    $_SESSION["customer"] = $customer;
    setRememberCookie($token, time() + REMEMBER_COOKIE_LIFETIME, $secure);

    return $customer;
}

function refreshRememberedDevice(PDO $pdo, array $customer, bool $secure): void
{
    $token = getRememberToken();
    if ($token === null) {
        return;
    }

    $tokenHash = hash("sha256", $token);
    $check = $pdo->prepare("
        SELECT id FROM customer_remember_tokens
        WHERE token_hash = :token_hash AND customer_id = :customer_id
        LIMIT 1
    ");
    $check->execute([
        "token_hash" => $tokenHash,
        "customer_id" => $customer["id"]
    ]);
    if (!$check->fetch()) {
        setRememberCookie("", time() - 42000, $secure);
        return;
    }

    $update = $pdo->prepare("
        UPDATE customer_remember_tokens
        SET last_used_at = CURRENT_TIMESTAMP
        WHERE token_hash = :token_hash
    ");
    $update->execute(["token_hash" => $tokenHash]);
    setRememberCookie($token, time() + REMEMBER_COOKIE_LIFETIME, $secure);
}

$secureCookie = !empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off";
ini_set("session.gc_maxlifetime", (string) (30 * 24 * 60 * 60));
ini_set("session.use_strict_mode", "1");
session_name("jmali_customer_session");
session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "secure" => $secureCookie,
    "httponly" => true,
    "samesite" => "Lax"
]);
session_start();

try {
    require_once __DIR__ . "/db.php";
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS customer_accounts (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            full_name VARCHAR(120) NOT NULL,
            email VARCHAR(254) NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            account_type ENUM('individual', 'restaurant') NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY customer_accounts_email_unique (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS customer_remember_tokens (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            customer_id BIGINT UNSIGNED NOT NULL,
            token_hash CHAR(64) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            last_used_at TIMESTAMP NULL DEFAULT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY customer_remember_tokens_hash_unique (token_hash),
            KEY customer_remember_tokens_customer_id (customer_id),
            CONSTRAINT customer_remember_tokens_customer_fk
                FOREIGN KEY (customer_id) REFERENCES customer_accounts (id)
                ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS customer_password_resets (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            customer_id BIGINT UNSIGNED NOT NULL,
            token_hash CHAR(64) NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY customer_password_resets_hash_unique (token_hash),
            KEY customer_password_resets_customer_id (customer_id),
            CONSTRAINT customer_password_resets_customer_fk
                FOREIGN KEY (customer_id) REFERENCES customer_accounts (id)
                ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
} catch (Throwable $error) {
    error_log("JM Ali account database error: " . $error->getMessage());
    respond(500, ["message" => "Account service is unavailable. Please try again later."]);
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    if (empty($_SESSION["customer"])) {
        $customer = restoreRememberedCustomer($pdo, $secureCookie);
        respond(200, ["user" => $customer]);
    }
    refreshRememberedDevice($pdo, $_SESSION["customer"], $secureCookie);
    respond(200, ["user" => $_SESSION["customer"] ?? null]);
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Allow: GET, POST");
    respond(405, ["message" => "This request method is not supported."]);
}

$request = json_decode(file_get_contents("php://input"), true);
if (!is_array($request)) {
    respond(400, ["message" => "Please submit a valid account request."]);
}

$action = $request["action"] ?? "";
if ($action === "logout") {
    clearRememberedDevice($pdo, $secureCookie);
    $_SESSION = [];
    setCustomerSessionCookie(time() - 42000, $secureCookie);
    session_destroy();
    respond(200, ["message" => "You have logged out."]);
}

if ($action === "request_reset") {
    $email = strtolower(trim((string) ($request["email"] ?? "")));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
        respond(400, ["message" => "Enter a valid email address."]);
    }

    $baseUrl = rtrim(trim((string) getenv("JMALI_BASE_URL")), "/");
    $mailFrom = trim((string) getenv("JMALI_MAIL_FROM"));
    $baseUrlParts = parse_url($baseUrl);
    if (
        !filter_var($baseUrl, FILTER_VALIDATE_URL) ||
        !in_array($baseUrlParts["scheme"] ?? "", ["http", "https"], true) ||
        !filter_var($mailFrom, FILTER_VALIDATE_EMAIL)
    ) {
        respond(503, ["message" => "Password reset email is not configured yet. Please contact JM Ali."]);
    }

    $lookup = $pdo->prepare("SELECT id FROM customer_accounts WHERE email = :email LIMIT 1");
    $lookup->execute(["email" => $email]);
    $account = $lookup->fetch();
    if ($account) {
        $token = bin2hex(random_bytes(32));
        $tokenHash = hash("sha256", $token);
        $pdo->beginTransaction();
        $removePrevious = $pdo->prepare("DELETE FROM customer_password_resets WHERE customer_id = :customer_id");
        $removePrevious->execute(["customer_id" => $account["id"]]);
        $insertReset = $pdo->prepare("
            INSERT INTO customer_password_resets (customer_id, token_hash, expires_at)
            VALUES (:customer_id, :token_hash, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 HOUR))
        ");
        $insertReset->execute([
            "customer_id" => $account["id"],
            "token_hash" => $tokenHash
        ]);
        $pdo->commit();

        $resetUrl = $baseUrl . "/index.html?reset=" . rawurlencode($token);
        $isMalay = ($request["language"] ?? "en") === "ms";
        $subject = $isMalay ? "Tetapkan semula kata laluan JM Ali" : "Reset your JM Ali password";
        $message = $isMalay
            ? "Kami menerima permintaan untuk menetapkan semula kata laluan JM Ali anda.\r\n\r\n"
                . "Gunakan pautan sekali guna ini dalam masa 1 jam:\r\n"
                . $resetUrl
                . "\r\n\r\nJika anda tidak meminta pautan ini, abaikan e-mel ini."
            : "We received a request to reset your JM Ali password.\r\n\r\n"
                . "Use this one-time link within 1 hour:\r\n"
                . $resetUrl
                . "\r\n\r\nIf you did not request this, you can ignore this email.";
        $headers = "From: JM Ali <" . $mailFrom . ">\r\n"
            . "Content-Type: text/plain; charset=UTF-8\r\n";
        if (!mail($email, $subject, $message, $headers)) {
            error_log("JM Ali password reset email could not be sent.");
        }
    }

    respond(200, [
        "message" => "If an account exists for this email, password reset instructions have been sent."
    ]);
}

if ($action === "reset_password") {
    $token = (string) ($request["token"] ?? "");
    $password = (string) ($request["password"] ?? "");
    if (!preg_match("/\\A[a-f0-9]{64}\\z/i", $token)) {
        respond(400, ["message" => "This reset link is invalid or has expired."]);
    }
    if (strlen($password) < 8 || strlen($password) > 4096) {
        respond(400, ["message" => "Your password must be at least 8 characters."]);
    }

    $pdo->beginTransaction();
    $lookup = $pdo->prepare("
        SELECT customer_id FROM customer_password_resets
        WHERE token_hash = :token_hash AND expires_at > CURRENT_TIMESTAMP
        LIMIT 1 FOR UPDATE
    ");
    $lookup->execute(["token_hash" => hash("sha256", $token)]);
    $reset = $lookup->fetch();
    if (!$reset) {
        $pdo->rollBack();
        respond(400, ["message" => "This reset link is invalid or has expired."]);
    }

    $customerId = (int) $reset["customer_id"];
    $updatePassword = $pdo->prepare("UPDATE customer_accounts SET password_hash = :password_hash WHERE id = :customer_id");
    $updatePassword->execute([
        "password_hash" => password_hash($password, PASSWORD_DEFAULT),
        "customer_id" => $customerId
    ]);
    $deleteResets = $pdo->prepare("DELETE FROM customer_password_resets WHERE customer_id = :customer_id");
    $deleteResets->execute(["customer_id" => $customerId]);
    $deleteRememberedDevices = $pdo->prepare("DELETE FROM customer_remember_tokens WHERE customer_id = :customer_id");
    $deleteRememberedDevices->execute(["customer_id" => $customerId]);
    $pdo->commit();

    if ((int) ($_SESSION["customer"]["id"] ?? 0) === $customerId) {
        $_SESSION = [];
        setCustomerSessionCookie(time() - 42000, $secureCookie);
        setRememberCookie("", time() - 42000, $secureCookie);
        session_destroy();
    }
    respond(200, ["message" => "Your password has been updated. You can now log in."]);
}

if (!in_array($action, ["login", "signup"], true)) {
    respond(400, ["message" => "Choose log in or sign up to continue."]);
}

$email = strtolower(trim((string) ($request["email"] ?? "")));
$password = (string) ($request["password"] ?? "");
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
    respond(400, ["message" => "Enter a valid email address."]);
}
if (strlen($password) < 8 || strlen($password) > 4096) {
    respond(400, ["message" => "Your password must be at least 8 characters."]);
}

if ($action === "signup") {
    $fullName = trim((string) ($request["full_name"] ?? ""));
    $accountType = $request["account_type"] ?? "";
    if ($fullName === "" || strlen($fullName) > 120) {
        respond(400, ["message" => "Enter your name (up to 120 characters)."]);
    }
    if (!in_array($accountType, ["individual", "restaurant"], true)) {
        respond(400, ["message" => "Choose Individual or Restaurant."]);
    }

    try {
        $statement = $pdo->prepare("
            INSERT INTO customer_accounts (full_name, email, password_hash, account_type)
            VALUES (:full_name, :email, :password_hash, :account_type)
        ");
        $statement->execute([
            "full_name" => $fullName,
            "email" => $email,
            "password_hash" => password_hash($password, PASSWORD_DEFAULT),
            "account_type" => $accountType
        ]);
        $customer = [
            "id" => (int) $pdo->lastInsertId(),
            "full_name" => $fullName,
            "email" => $email,
            "account_type" => $accountType
        ];
    } catch (PDOException $error) {
        if ($error->getCode() === "23000") {
            respond(409, ["message" => "An account with this email already exists. Log in instead."]);
        }
        error_log("JM Ali account registration error: " . $error->getMessage());
        respond(500, ["message" => "Your account could not be created. Please try again."]);
    }
} else {
    $statement = $pdo->prepare("
        SELECT id, full_name, email, password_hash, account_type
        FROM customer_accounts
        WHERE email = :email
        LIMIT 1
    ");
    $statement->execute(["email" => $email]);
    $account = $statement->fetch();
    if (!$account || !password_verify($password, $account["password_hash"])) {
        respond(401, ["message" => "Email or password is incorrect."]);
    }
    $customer = [
        "id" => (int) $account["id"],
        "full_name" => $account["full_name"],
        "email" => $account["email"],
        "account_type" => $account["account_type"]
    ];
}

session_regenerate_id(true);
$_SESSION["customer"] = $customer;
if (!empty($request["remember"])) {
    clearRememberedDevice($pdo, $secureCookie);
    createRememberedDevice($pdo, $customer["id"], $secureCookie);
} else {
    clearRememberedDevice($pdo, $secureCookie);
}

respond(200, ["user" => $customer]);