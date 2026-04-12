<?php
require_once __DIR__ . '/../core/Env.php';
Env::load(__DIR__ . '/../../.env');

class Database {
    private static $instance = null;
    private $conn;

    // Private constructor agar tidak bisa di-instansiasi pakai keyword 'new' di luar kelas
    private function __construct() {
        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $db_name = getenv('DB_NAME');
        $username = getenv('DB_USER');
        $password = getenv('DB_PASS');

        $this->conn = new PDO("mysql:host={$host};dbname={$db_name}", $username, $password);
        // Mode error exception agar mudah di-debug
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // Default fetch data sebagai array asosiatif
        $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    }

    // Metode ini yang akan dipakai di seluruh aplikasi untuk ambil 1 koneksi yang sama
    public static function getConnection() {
        if (self::$instance == null) {
            self::$instance = new Database();
        }
        return self::$instance->conn;
    }
}
