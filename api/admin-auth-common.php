<?php

function getAdminDatabase(): PDO
{
    require __DIR__ . "/db.php";
    $pdo->exec("CREATE TABLE IF NOT EXISTS admins (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(254) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(32) NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY admins_email_unique (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    return $pdo;
}

function startAdminSession(): void
{
    $secureCookie = !empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off";
    ini_set("session.use_strict_mode", "1");
    session_name("jmali_admin_session");
    session_set_cookie_params([
        "lifetime" => 0,
        "path" => "/",
        "secure" => $secureCookie,
        "httponly" => true,
        "samesite" => "Lax"
    ]);
    session_start();
}