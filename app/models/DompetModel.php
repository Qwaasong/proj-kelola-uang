<?php
require_once __DIR__ . '/../config/database.php';

class DompetModel {
    private $conn;

    public function __construct() {
        $this->conn = Database::getConnection();
    }

    // Ambil data dompet user
    public function getAll($user_id) {
        $query = "SELECT id, nama_dompet, saldo FROM dompet WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Tambah dompet baru
    public function create($user_id, $nama_dompet, $saldo) {
        $query = "INSERT INTO dompet (user_id, nama_dompet, saldo) VALUES (:user_id, :nama_dompet, :saldo)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':nama_dompet', $nama_dompet);
        $stmt->bindParam(':saldo', $saldo);
        return $stmt->execute();
    }

    // Transfer antar dompet menggunakan Transaction SQL agar aman
    public function transfer($user_id, $dari_id, $ke_id, $jumlah) {
        try {
            $this->conn->beginTransaction();

            // 1. Cek saldo dompet pengirim
            $queryCek = "SELECT saldo FROM dompet WHERE id = :id AND user_id = :user_id FOR UPDATE";
            $stmtCek = $this->conn->prepare($queryCek);
            $stmtCek->execute([':id' => $dari_id, ':user_id' => $user_id]);
            $dompet_dari = $stmtCek->fetch();

            if (!$dompet_dari || $dompet_dari['saldo'] < $jumlah) {
                $this->conn->rollBack();
                return "Saldo dompet asal tidak mencukupi atau dompet tidak ditemukan!";
            }

            // 2. Kurangi saldo dompet asal
            $queryKurang = "UPDATE dompet SET saldo = saldo - :jumlah WHERE id = :id AND user_id = :user_id";
            $stmtKurang = $this->conn->prepare($queryKurang);
            $stmtKurang->execute([':jumlah' => $jumlah, ':id' => $dari_id, ':user_id' => $user_id]);

            // 3. Tambahkan saldo ke dompet tujuan
            $queryTambah = "UPDATE dompet SET saldo = saldo + :jumlah WHERE id = :id AND user_id = :user_id";
            $stmtTambah = $this->conn->prepare($queryTambah);
            $stmtTambah->execute([':jumlah' => $jumlah, ':id' => $ke_id, ':user_id' => $user_id]);

            // Jika semua lancar, simpan permanen (Commit)
            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    public function delete($id, $user_id) {
        $query = "DELETE FROM dompet WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':user_id', $user_id);
        return $stmt->execute();
    }
}