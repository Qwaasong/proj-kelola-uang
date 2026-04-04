<?php
require_once __DIR__ . '/../config/database.php';

class ReportModel {
    private $conn;

    public function __construct() {
        $this->conn = Database::getConnection();
    }

    // Fungsi untuk mengambil riwayat transaksi dengan filter opsional
    public function getHistory($user_id, $filters = []) {
        $query = "SELECT * FROM transaksi WHERE user_id = :user_id";
        $params = [':user_id' => $user_id];

        // Jika ada filter jenis (Pemasukan/Pengeluaran/Tabungan)
        if (!empty($filters['jenis'])) {
            $query .= " AND jenis = :jenis";
            $params[':jenis'] = $filters['jenis'];
        }

        // Jika ada filter rentang tanggal (rekap bulanan/tahunan)
        if (!empty($filters['tanggal_mulai']) && !empty($filters['tanggal_selesai'])) {
            $query .= " AND tanggal BETWEEN :start_date AND :end_date";
            $params[':start_date'] = $filters['tanggal_mulai'];
            $params[':end_date'] = $filters['tanggal_selesai'];
        }

        // Urutkan dari yang paling baru
        $query .= " ORDER BY tanggal DESC, created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        
        return $stmt->fetchAll();
    }

    // Fungsi untuk menghitung ringkasan saldo terkini
    public function getSummary($user_id) {
        $query = "SELECT jenis, SUM(jumlah) as total FROM transaksi WHERE user_id = :user_id GROUP BY jenis";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        $results = $stmt->fetchAll();

        $pemasukan = 0;
        $pengeluaran = 0;
        $tabungan = 0;

        foreach ($results as $row) {
            if ($row['jenis'] == 'Pemasukan') $pemasukan = $row['total'];
            if ($row['jenis'] == 'Pengeluaran') $pengeluaran = $row['total'];
            if ($row['jenis'] == 'Tabungan') $tabungan = $row['total'];
        }

        // Rumus saldo: Pemasukan - (Pengeluaran + Tabungan)
        $saldo_terkini = $pemasukan - $pengeluaran - $tabungan;

        return [
            'total_pemasukan' => (float)$pemasukan,
            'total_pengeluaran' => (float)$pengeluaran,
            'total_tabungan' => (float)$tabungan,
            'saldo_terkini' => (float)$saldo_terkini
        ];
    }
}