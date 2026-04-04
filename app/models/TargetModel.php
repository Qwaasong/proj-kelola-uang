<?php
require_once __DIR__ . '/../config/database.php';

class TargetModel {
    private $conn;
    public function __construct() { $this->conn = Database::getConnection(); }

    public function getAll($user_id) {
        $stmt = $this->conn->prepare("SELECT * FROM target_finansial WHERE user_id = :user_id ORDER BY created_at DESC");
        $stmt->execute([':user_id' => $user_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($user_id, $nama, $target, $tgl) {
        $stmt = $this->conn->prepare("INSERT INTO target_finansial (user_id, nama_target, jumlah_target, terkumpul, tanggal_tercapai) 
                                      VALUES (:uid, :nama, :target, 0, :tgl)");
        return $stmt->execute([':uid' => $user_id, ':nama' => $nama, ':target' => $target, ':tgl' => $tgl]);
    }

    public function addDana($user_id, $target_id, $dompet_id, $jumlah) {
        try {
            $this->conn->beginTransaction();
            
            $stmtCek = $this->conn->prepare("SELECT saldo FROM dompet WHERE id = :id AND user_id = :uid FOR UPDATE");
            $stmtCek->execute([':id' => $dompet_id, ':uid' => $user_id]);
            $dompet = $stmtCek->fetch();
            if (!$dompet || $dompet['saldo'] < $jumlah) throw new Exception("Saldo dompet tidak cukup.");

            $this->conn->prepare("UPDATE dompet SET saldo = saldo - :jumlah WHERE id = :id")->execute([':jumlah' => $jumlah, ':id' => $dompet_id]);
            $this->conn->prepare("UPDATE target_finansial SET terkumpul = terkumpul + :jumlah WHERE id = :gid AND user_id = :uid")
                 ->execute([':jumlah' => $jumlah, ':gid' => $target_id, ':uid' => $user_id]);

            $this->conn->prepare("INSERT INTO transaksi (user_id, dompet_id, target_id, nama_transaksi, jenis, tipe, jumlah, tanggal) 
                                  VALUES (:uid, :did, :gid, 'Nabung Target', 'Tabungan', 'BARU', :jumlah, CURRENT_DATE())")
                 ->execute([':uid' => $user_id, ':did' => $dompet_id, ':gid' => $target_id, ':jumlah' => $jumlah]);

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return $e->getMessage();
        }
    }
}