<?php
require_once __DIR__ . '/../config/database.php';

class UserModel {
    private $conn;
    private $table_name = "users"; // Sesuai dengan Tabel users 

    public function __construct() {
        $this->conn = Database::getConnection();
    }

    // Fungsi untuk mengecek apakah username sudah dipakai
    public function isUsernameExists($username) {
        $query = "SELECT id FROM " . $this->table_name . " WHERE username = :username LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // Fungsi untuk Register
    public function register($username, $password) {
        $query = "INSERT INTO " . $this->table_name . " (username, password) VALUES (:username, :password)";
        $stmt = $this->conn->prepare($query);

        // HASH PASSWORD
        $password_hash = password_hash($password, PASSWORD_BCRYPT);

        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $password_hash);

        return $stmt->execute();
    }

    // Fungsi untuk Login
    public function login($username, $password) {
        $query = "SELECT id, username, password FROM " . $this->table_name . " WHERE username = :username LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch();
            // Cek apakah password cocok
            if(password_verify($password, $row['password'])) {
                unset($row['password']); // Hapus password dari respons
                return $row;
            }
        }
        return false;
    }
}