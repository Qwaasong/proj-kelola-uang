<?php
require_once __DIR__ . '/../config/database.php';

class TransactionModel {
    private $conn;
    private $table_name = "transaksi";

    public function __construct() {
        $this->conn = Database::getConnection();
    }

    public function createAwal($user_id, $nama_transaksi, $jenis, $jumlah, $tanggal, $keterangan) {
        $query = "INSERT INTO " . $this->table_name . " 
                  (user_id, nama_transaksi, jenis, tipe, jumlah, tanggal, keterangan) 
                  VALUES 
                  (:user_id, :nama_transaksi, :jenis, 'AWAL', :jumlah, :tanggal, :keterangan)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':nama_transaksi', $nama_transaksi);
        $stmt->bindParam(':jenis', $jenis);
        $stmt->bindParam(':jumlah', $jumlah);
        $stmt->bindParam(':tanggal', $tanggal);
        $stmt->bindParam(':keterangan', $keterangan);
        return $stmt->execute();
    }

    public function createBaru($user_id, $nama_transaksi, $jenis, $jumlah, $tanggal, $keterangan) {
        $query = "INSERT INTO " . $this->table_name . " 
                  (user_id, nama_transaksi, jenis, tipe, jumlah, tanggal, keterangan) 
                  VALUES 
                  (:user_id, :nama_transaksi, :jenis, 'BARU', :jumlah, :tanggal, :keterangan)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':nama_transaksi', $nama_transaksi);
        $stmt->bindParam(':jenis', $jenis); 
        $stmt->bindParam(':jumlah', $jumlah);
        $stmt->bindParam(':tanggal', $tanggal);
        $stmt->bindParam(':keterangan', $keterangan);
        return $stmt->execute();
    }

    // --- BARU: Fungsi khusus untuk Tabungan ---
    public function createTabungan($user_id, $jumlah, $tanggal, $keterangan, $target_id) {
        // Nama transaksi otomatis 'Alokasi Tabungan', jenis 'Tabungan', tipe 'BARU'
        $query = "INSERT INTO " . $this->table_name . " 
                  (user_id, nama_transaksi, jenis, tipe, jumlah, tanggal, keterangan, target_id) 
                  VALUES 
                  (:user_id, 'Alokasi Tabungan', 'Tabungan', 'BARU', :jumlah, :tanggal, :keterangan, :target_id)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':jumlah', $jumlah);
        $stmt->bindParam(':tanggal', $tanggal);
        $stmt->bindParam(':keterangan', $keterangan);
        $stmt->bindParam(':target_id', $target_id);
        return $stmt->execute();
    }
}