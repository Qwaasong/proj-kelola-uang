<?php
require_once __DIR__ . '/../config/database.php';

class RecurringModel {
    private $conn;

    public function __construct() {
        $this->conn = Database::getConnection();
    }

    public function createPemasukanBerulang($user_id, $nama_pemasukan, $jumlah, $frekuensi, $tanggal_mulai) {
        $query = "INSERT INTO pemasukan_berulang (user_id, nama_pemasukan, jumlah, frekuensi, tanggal_mulai) 
                  VALUES (:user_id, :nama_pemasukan, :jumlah, :frekuensi, :tanggal_mulai)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':nama_pemasukan', $nama_pemasukan);
        $stmt->bindParam(':jumlah', $jumlah);
        $stmt->bindParam(':frekuensi', $frekuensi);
        $stmt->bindParam(':tanggal_mulai', $tanggal_mulai);

        return $stmt->execute();
    }

    public function createPengeluaranBerulang($user_id, $nama_pengeluaran, $jumlah, $frekuensi, $tanggal_mulai) {
        $query = "INSERT INTO pengeluaran_berulang (user_id, nama_pengeluaran, jumlah, frekuensi, tanggal_mulai) 
                  VALUES (:user_id, :nama_pengeluaran, :jumlah, :frekuensi, :tanggal_mulai)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':nama_pengeluaran', $nama_pengeluaran);
        $stmt->bindParam(':jumlah', $jumlah);
        $stmt->bindParam(':frekuensi', $frekuensi);
        $stmt->bindParam(':tanggal_mulai', $tanggal_mulai);

        return $stmt->execute();
    }
}