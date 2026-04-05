<?php
require_once __DIR__ . '/../config/database.php';

class DanaDaruratModel {
    private $conn;
    public function __construct() { $this->conn = Database::getConnection(); }

    public function get($user_id) {
        $stmt = $this->conn->prepare("SELECT * FROM dana_darurat WHERE user_id = :user_id LIMIT 1");
        $stmt->execute([':user_id' => $user_id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($data) {
            $data['log'] = $this->getLogs($user_id);
        } else {
            $data = ["jumlah_target" => 0, "jumlah_terkumpul" => 0, "log" => []];
        }
        
        return $data;
    }

    public function getLogs($user_id) {
        $query = "SELECT t.*, d.nama_dompet 
                  FROM transaksi t
                  LEFT JOIN dompet d ON t.dompet_id = d.id
                  WHERE t.user_id = :user_id 
                  AND t.jenis = 'Tabungan' 
                  AND t.target_id IS NULL
                  ORDER BY t.tanggal DESC, t.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':user_id' => $user_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function setTarget($user_id, $target) {
        $cek = $this->get($user_id);
        if ($cek) {
            $stmt = $this->conn->prepare("UPDATE dana_darurat SET jumlah_target = :target WHERE user_id = :user_id");
        } else {
            $stmt = $this->conn->prepare("INSERT INTO dana_darurat (user_id, jumlah_target, jumlah_terkumpul) VALUES (:user_id, :target, 0)");
        }
        return $stmt->execute([':target' => $target, ':user_id' => $user_id]);
    }

    public function addDana($user_id, $dompet_id, $jumlah) {
        try {
            $this->conn->beginTransaction();
            
            // 1. Cek saldo dompet
            $stmtCek = $this->conn->prepare("SELECT saldo FROM dompet WHERE id = :id AND user_id = :uid FOR UPDATE");
            $stmtCek->execute([':id' => $dompet_id, ':uid' => $user_id]);
            $dompet = $stmtCek->fetch();
            if (!$dompet || $dompet['saldo'] < $jumlah) throw new Exception("Saldo dompet tidak cukup.");

            // 2. Kurangi saldo dompet
            $stmtDompet = $this->conn->prepare("UPDATE dompet SET saldo = saldo - :jumlah WHERE id = :id");
            $stmtDompet->execute([':jumlah' => $jumlah, ':id' => $dompet_id]);

            // 3. Tambah ke Dana Darurat
            $stmtDana = $this->conn->prepare("UPDATE dana_darurat SET jumlah_terkumpul = jumlah_terkumpul + :jumlah WHERE user_id = :uid");
            $stmtDana->execute([':jumlah' => $jumlah, ':uid' => $user_id]);

            // 4. Catat di Riwayat Transaksi (sebagai Tabungan)
            $stmtLog = $this->conn->prepare("INSERT INTO transaksi (user_id, dompet_id, keterangan, jenis, tipe, jumlah, tanggal) 
                                             VALUES (:uid, :did, 'Alokasi Dana Darurat', 'Tabungan', 'BARU', :jumlah, CURRENT_DATE())");
            $stmtLog->execute([':uid' => $user_id, ':did' => $dompet_id, ':jumlah' => $jumlah]);

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return $e->getMessage();
        }
    }
}