<?php
class RecurringModel {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function createRecurringPemasukan($data) {
        $sql = "INSERT INTO pemasukan_berulang (user_id, nama_pemasukan, jumlah, frekuensi, tanggal_mulai) 
                VALUES (:user_id, :nama, :jumlah, :frekuensi, :tanggal)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':user_id' => $data['user_id'],
            ':nama' => $data['nama'],
            ':jumlah' => $data['jumlah'],
            ':frekuensi' => $data['frekuensi'],
            ':tanggal' => $data['tanggal']
        ]);
    }

    public function createRecurringPengeluaran($data) {
        $sql = "INSERT INTO pengeluaran_berulang (user_id, nama_pengeluaran, jumlah, frekuensi, tanggal_mulai) 
                VALUES (:user_id, :nama, :jumlah, :frekuensi, :tanggal)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':user_id' => $data['user_id'],
            ':nama' => $data['nama'],
            ':jumlah' => $data['jumlah'],
            ':frekuensi' => $data['frekuensi'],
            ':tanggal' => $data['tanggal']
        ]);
    }
}