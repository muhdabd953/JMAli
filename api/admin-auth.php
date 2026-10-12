<?php

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store");
require_once __DIR__ . "/admin-auth-common.php";

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

try {
    startAdminSession();
    $pdo = getAdminDatabase();
} catch (Throwable $error) {
    error_log("JM Ali admin authentication error: " . $error->getMessage());
    respond(503, ["message" => "Admin sign-in is unavailable. Check the database connection."]);
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    respond(200, ["user" => $_SESSION["admin"] ?? null]);
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Allow: GET, POST");
    respond(405, ["message" => "This request method is not supported."]);
}

$request = json_decode(file_get_contents("php://input"), true);
if (!is_array($request)) {
    respond(400, ["message" => "Please submit a valid sign-in request."]);
}

$action = $request["action"] ?? "";
if ($action === "logout") {
    $cookie = session_get_cookie_params();
    setcookie(session_name(), "", [
        "expires" => time() - 42000,
        "path" => $cookie["path"],
        "secure" => $cookie["secure"],
        "httponly" => $cookie["httponly"],
        "samesite" => "Lax"
    ]);
    $_SESSION = [];
    session_destroy();
    respond(200, ["message" => "You have logged out."]);
}

if ($action !== "login") {
    respond(400, ["message" => "Choose log in to continue."]);
}

$email = strtolower(trim((string) ($request["email"] ?? "")));
$password = (string) ($request["password"] ?? "");
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 || $password === "" || strlen($password) > 4096) {
    respond(400, ["message" => "Enter a valid email address and password."]);
}

$statement = $pdo->prepare("SELECT id, name, email, password_hash, role FROM admins WHERE email = :email LIMIT 1");
$statement->execute(["email" => $email]);
$account = $statement->fetch();
if (!$account || !password_verify($password, $account["password_hash"])) {
    respond(401, ["message" => "Email or password is incorrect."]);
}

session_regenerate_id(true);
$_SESSION["admin"] = [
    "id" => (int) $account["id"],
    "name" => $account["name"],
    "email" => $account["email"],
    "role" => $account["role"]
];
respond(200, ["user" => $_SESSION["admin"]]);