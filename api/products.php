<?php

header("Content-Type: application/json");
require_once "db.php";

try {
    $statement = $pdo->query("
        SELECT
            products.id,
            products.name,
            products.current_price,
            products.unit,
            products.image_url,
            categories.name AS category
        FROM products
        JOIN categories
            ON categories.id = products.category_id
        WHERE products.is_active = 1
        ORDER BY products.name
    ");

    echo json_encode($statement->fetchAll());
} catch (PDOException $error) {
    http_response_code(500);
    echo json_encode(["error" => "Could not load products"]);
}