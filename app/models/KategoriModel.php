<?php
require_once __DIR__ . '/../config/database.php';

class KategoriModel {
    private $conn;

    public function __construct() {
        $this->conn = Database::getConnection();
    }

    // Mengambil semua kategori (nanti Frontend bisa filter berdasarkan tipe)
    public function getAll() {
        $query = "SELECT id, nama_kategori, tipe FROM kategori ORDER BY tipe, nama_kategori";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}