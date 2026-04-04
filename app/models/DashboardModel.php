<?php
require_once __DIR__ . '/../config/database.php';

class DashboardModel {
    private $conn;

    public function __construct() {
        $this->conn = Database::getConnection();
    }

    public function getTotalSaldo($user_id) {
        $query = "SELECT SUM(saldo) as total_saldo FROM dompet WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':user_id' => $user_id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total_saldo'] ? (float)$row['total_saldo'] : 0;
    }

    public function getSummaryBulanan($user_id, $bulan, $tahun) {
        $query = "SELECT jenis, SUM(jumlah) as total FROM transaksi 
                  WHERE user_id = :user_id AND MONTH(tanggal) = :bulan AND YEAR(tanggal) = :tahun 
                  GROUP BY jenis";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':user_id' => $user_id, ':bulan' => $bulan, ':tahun' => $tahun]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $data = ['Pemasukan' => 0, 'Pengeluaran' => 0];
        foreach ($result as $row) {
            $data[$row['jenis']] = (float)$row['total'];
        }
        return $data;
    }

    public function getDanaDarurat($user_id) {
        $query = "SELECT jumlah_target, jumlah_terkumpul FROM dana_darurat WHERE user_id = :user_id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':user_id' => $user_id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            return ['target' => (float)$row['jumlah_target'], 'terkumpul' => (float)$row['jumlah_terkumpul']];
        }
        return ['target' => 0, 'terkumpul' => 0]; // Default jika belum set dana darurat
    }

    public function getTransaksiHariIni($user_id) {
        $query = "SELECT jenis, SUM(jumlah) as total FROM transaksi 
                  WHERE user_id = :user_id AND tanggal = CURRENT_DATE() GROUP BY jenis";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':user_id' => $user_id]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $data = ['Pemasukan' => 0, 'Pengeluaran' => 0];
        foreach ($result as $row) {
            $data[$row['jenis']] = (float)$row['total'];
        }
        return $data;
    }

    public function getChartKategori($user_id, $bulan, $tahun) {
        $query = "SELECT k.nama_kategori, SUM(t.jumlah) as total 
                  FROM transaksi t JOIN kategori k ON t.kategori_id = k.id 
                  WHERE t.user_id = :user_id AND t.jenis = 'Pengeluaran' 
                  AND MONTH(t.tanggal) = :bulan AND YEAR(t.tanggal) = :tahun 
                  GROUP BY k.nama_kategori ORDER BY total DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':user_id' => $user_id, ':bulan' => $bulan, ':tahun' => $tahun]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getGrafikWaktu($user_id, $bulan, $tahun) {
        $query = "SELECT tanggal, jenis, SUM(jumlah) as total 
                  FROM transaksi 
                  WHERE user_id = :user_id AND MONTH(tanggal) = :bulan AND YEAR(tanggal) = :tahun 
                  GROUP BY tanggal, jenis ORDER BY tanggal ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':user_id' => $user_id, ':bulan' => $bulan, ':tahun' => $tahun]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getLogTransaksi($user_id, $limit = 3) {
        $query = "SELECT t.id, t.nama_transaksi, t.jenis, t.jumlah, t.tanggal, d.nama_dompet, k.nama_kategori 
                  FROM transaksi t 
                  LEFT JOIN dompet d ON t.dompet_id = d.id 
                  LEFT JOIN kategori k ON t.kategori_id = k.id 
                  WHERE t.user_id = :user_id 
                  ORDER BY t.tanggal DESC, t.created_at DESC LIMIT :limit";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}