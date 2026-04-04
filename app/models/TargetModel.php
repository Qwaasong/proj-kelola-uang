<?php
require_once __DIR__ . '/../config/database.php';

class TargetModel {
    private $conn;

    public function __construct() {
        $this->conn = Database::getConnection();
    }

    public function createTarget($user_id, $nama_target, $jumlah_target, $tanggal_tercapai) {
        $query = "INSERT INTO target_finansial (user_id, nama_target, jumlah_target, tanggal_tercapai) 
                  VALUES (:user_id, :nama_target, :jumlah_target, :tanggal_tercapai)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':nama_target', $nama_target);
        $stmt->bindParam(':jumlah_target', $jumlah_target);
        $stmt->bindParam(':tanggal_tercapai', $tanggal_tercapai);

        return $stmt->execute();
    }
}