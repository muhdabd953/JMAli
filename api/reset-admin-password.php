<?php

if (PHP_SAPI !== "cli") {
    http_response_code(404);
    exit;
}

require_once __DIR__ . "/admin-auth-common.php";

$email = strtolower(trim((string) ($argv[1] ?? "")));
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 || ($argv[2] ?? "") !== "--stdin-password") {
    fwrite(STDERR, "Use api/admin-account.ps1 -Action reset to reset an admin password.\n");
    exit(1);
}

try {
    $pdo = getAdminDatabase();
    $lookup = $pdo->prepare("SELECT id FROM admins WHERE email = :email LIMIT 1");
    $lookup->execute(["email" => $email]);
    $admin = $lookup->fetch();
    if (!$admin) {
        fwrite(STDERR, "No admin account exists for that email.\n");
        exit(1);
    }

    $password = trim((string) fgets(STDIN));
    if (strlen($password) < 12 || strlen($password) > 4096) {
        fwrite(STDERR, "Password must be between 12 and 4096 characters.\n");
        exit(1);
    }

    $update = $pdo->prepare("UPDATE admins SET password_hash = :password_hash WHERE id = :id");
    $update->execute([
        "password_hash" => password_hash($password, PASSWORD_DEFAULT),
        "id" => $admin["id"]
    ]);
    fwrite(STDOUT, "Admin password updated.\n");
} catch (Throwable $error) {
    fwrite(STDERR, "Could not update the admin password: " . $error->getMessage() . "\n");
    exit(1);
}