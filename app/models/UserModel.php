<?php

class UserModel
{

    private $conn;
    private $table = "users";

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function usernameExists($username)
    {
        $stmt = $this->conn->prepare("SELECT id FROM {$this->table} WHERE username = :username");
        $stmt->execute([":username" => $username]);
        return $stmt->rowCount() > 0;
    }

    public function getUserByUsername($username)
    {
        $stmt = $this->conn->prepare("SELECT id, username, password FROM {$this->table} WHERE username = :username");
        $stmt->execute([":username" => $username]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function save($data)
    {
        // Karena field name dipecah atau dihilangkan, kita pakai first_name & last_name yang default kosong.
        // Di tabel users ada `username`, `first_name`, `last_name`, `password`.
        $stmt = $this->conn->prepare("
            INSERT INTO {$this->table} (username, first_name, last_name, password)
            VALUES (:username, '', '', :password)
        ");

        // Kita hanya mengambil username dan password dari data yang di-pass, karena confirm_password sudah dibuang di LogicController (atau bisa di-bind manual).
        return $stmt->execute([
            ":username" => $data['username'],
            ":password" => $data['password']
        ]);
    }
}
