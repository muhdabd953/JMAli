<?php

if (PHP_SAPI !== "cli") {
    http_response_code(404);
    exit;
}

require_once __DIR__ . "/admin-auth-common.php";

$email = strtolower(trim((string) ($argv[1] ?? "")));
$name = trim((string) ($argv[2] ?? ""));
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 || $name === "" || strlen($name) > 120 || ($argv[3] ?? "") !== "--stdin-password") {
    fwrite(STDERR, "Use api/admin-account.ps1 -Action create to create an admin account.\n");
    exit(1);
}

try {
    $pdo = getAdminDatabase();
    $count = (int) $pdo->query("SELECT COUNT(*) FROM admins")->fetchColumn();
    if ($count > 0) {
        fwrite(STDERR, "An admin account already exists. New accounts must be created by an authenticated administrator.\n");
        exit(1);
    }

    $password = trim((string) fgets(STDIN));
    if (strlen($password) < 12 || strlen($password) > 4096) {
        fwrite(STDERR, "Password must be between 12 and 4096 characters.\n");
        exit(1);
    }

    $insert = $pdo->prepare("INSERT INTO admins (name, email, password_hash, role) VALUES (:name, :email, :password_hash, 'owner')");
    $insert->execute([
        "name" => $name,
        "email" => $email,
        "password_hash" => password_hash($password, PASSWORD_DEFAULT)
    ]);
    fwrite(STDOUT, "Admin account created. Sign in at Admin/login.html.\n");
} catch (Throwable $error) {
    fwrite(STDERR, "Could not create the admin account: " . $error->getMessage() . "\n");
    exit(1);
}