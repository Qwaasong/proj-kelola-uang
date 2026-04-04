<?php
require_once __DIR__ . '/../config/database.php';

class LaporanModel {
    private $conn;
    public function __construct() { $this->conn = Database::getConnection(); }

    public function getReport($user_id, $bulan, $tahun) {
        $query = "SELECT t.*, d.nama_dompet, k.nama_kategori 
                  FROM transaksi t 
                  LEFT JOIN dompet d ON t.dompet_id = d.id 
                  LEFT JOIN kategori k ON t.kategori_id = k.id 
                  WHERE t.user_id = :uid AND MONTH(t.tanggal) = :bulan AND YEAR(t.tanggal) = :tahun 
                  ORDER BY t.tanggal DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':uid' => $user_id, ':bulan' => $bulan, ':tahun' => $tahun]);
        $transaksi = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $total_in = 0; $total_out = 0; $total_save = 0;
        foreach($transaksi as $t) {
            if ($t['jenis'] === 'Pemasukan') $total_in += $t['jumlah'];
            if ($t['jenis'] === 'Pengeluaran') $total_out += $t['jumlah'];
            if ($t['jenis'] === 'Tabungan') $total_save += $t['jumlah'];
        }

        return [
            'ringkasan' => ['pemasukan' => $total_in, 'pengeluaran' => $total_out, 'tabungan' => $total_save],
            'detail_transaksi' => $transaksi
        ];
    }
}