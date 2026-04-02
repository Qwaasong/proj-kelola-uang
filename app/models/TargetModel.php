<?php
class TargetModel {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function createTarget($data) {
        $sql = "INSERT INTO target_finansial (user_id, nama_target, jumlah_target, tanggal_tercapai) 
                VALUES (:user_id, :nama_target, :jumlah_target, :tanggal_tercapai)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':user_id' => $data['user_id'],
            ':nama_target' => $data['nama_target'],
            ':jumlah_target' => $data['jumlah_target'],
            ':tanggal_tercapai' => $data['tanggal_tercapai'] ?? null
        ]);
    }

    public function getTargetsWithProgress($user_id) {
        // Query ini menggabungkan data target dengan total nominal transaksi tipe 'Tabungan' yang terkait
        $sql = "SELECT t.*, 
                COALESCE(SUM(tr.amount), 0) as current_savings 
                FROM target_finansial t 
                LEFT JOIN transactions tr ON t.id = tr.target_id AND tr.transaction_type = 'Tabungan'
                WHERE t.user_id = :user_id 
                GROUP BY t.id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':user_id' => $user_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}