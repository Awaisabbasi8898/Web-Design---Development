<?php
// db.php
// Database connection using PDO.
// Update the DSN/credentials to match your environment.

function getDB() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $host = '127.0.0.1';    // change if needed
    $db   = 'student_db';   // database name from SQL above
    $user = 'root';         // your DB user
    $pass = '';             // your DB password
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO($dsn, $user, $pass, $options);
        return $pdo;
    } catch (PDOException $e) {
        // In production do not echo details; log instead.
        echo "Database connection failed: " . htmlspecialchars($e->getMessage());
        exit;
    }
}
