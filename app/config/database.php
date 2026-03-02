<?php

require_once __DIR__ . '/../core/Response.php';

class Database
{

    private $host = "localhost";
    private $db_name = "uangmu_app_db";
    private $username = "root";
    private $password = "";
    public $conn;

    public function connect()
    {
        try {
            $this->conn = new PDO(
                "mysql:host={$this->host};dbname={$this->db_name}",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $this->conn;
        } catch (PDOException $e) {
            Response::error("Koneksi database gagal", 500);
        }
    }
}
