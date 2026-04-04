<?php
require_once __DIR__ . '/../config/database.php';

class LaporanModel
{
    private $conn;
    public function __construct()
    {
        $this->conn = Database::getConnection();
    }

    public function getReport($user_id, $bulan, $tahun)
    {
        $bulan = (int)$bulan;
        $tahun = (int)$tahun;

        // 1. Ringkasan & Detail Transaksi
        $query = "SELECT t.*, d.nama_dompet, k.nama_kategori 
                  FROM transaksi t 
                  LEFT JOIN dompet d ON t.dompet_id = d.id 
                  LEFT JOIN kategori k ON t.kategori_id = k.id 
                  WHERE t.user_id = :uid AND MONTH(t.tanggal) = :bulan AND YEAR(t.tanggal) = :tahun 
                  ORDER BY t.tanggal DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':uid' => $user_id, ':bulan' => $bulan, ':tahun' => $tahun]);
        $transaksi = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $total_in = 0; $total_out = 0; $total_sav = 0;
        foreach ($transaksi as $t) {
            if ($t['jenis'] === 'Pemasukan') $total_in += $t['jumlah'];
            if ($t['jenis'] === 'Pengeluaran') $total_out += $t['jumlah'];
            if ($t['jenis'] === 'Tabungan') $total_sav += $t['jumlah'];
        }

        // 2. Data Kategori (Distribusi)
        $query_cat = "SELECT k.nama_kategori as label, SUM(t.jumlah) as amount 
                      FROM transaksi t JOIN kategori k ON t.kategori_id = k.id 
                      WHERE t.user_id = :uid AND t.jenis = 'Pengeluaran' 
                      AND MONTH(t.tanggal) = :bulan AND YEAR(t.tanggal) = :tahun 
                      GROUP BY k.nama_kategori ORDER BY amount DESC";
        $stmt_cat = $this->conn->prepare($query_cat);
        $stmt_cat->execute([':uid' => $user_id, ':bulan' => $bulan, ':tahun' => $tahun]);
        $per_kategori = $stmt_cat->fetchAll(PDO::FETCH_ASSOC);
        
        $total_exp = array_sum(array_column($per_kategori, 'amount'));
        foreach ($per_kategori as &$cat) {
            $cat['value'] = $total_exp > 0 ? round(($cat['amount'] / $total_exp) * 100, 1) : 0;
        }

        // 3. Tren Arus Kas (Berdasarkan Periode)
        $period = $_GET['periode'] ?? 'Bulan Ini';
        $trend = $this->getTrendData($user_id, $period, $bulan, $tahun);

        // 4. Perbandingan Bulanan (4 Bulan Terakhir)
        $comparison = $this->getMonthlyComparison($user_id);

        return [
            'total_pemasukan' => $total_in,
            'total_pengeluaran' => $total_out,
            'total_tabungan' => $total_sav,
            'saldo_bersih' => $total_in - $total_out - $total_sav,
            'saving_rate' => $total_in > 0 ? round((($total_in - $total_out) / $total_in) * 100, 1) : 0,
            'per_kategori' => $per_kategori,
            'transaksi_terbesar' => array_slice($transaksi, 0, 5),
            'trend' => $trend,
            'comparison' => $comparison
        ];
    }

    private function getTrendData($user_id, $period, $bulan, $tahun) {
        if ($period === 'Minggu Ini') {
            $query = "SELECT DAYNAME(tanggal) as label, 
                             SUM(CASE WHEN jenis = 'Pemasukan' THEN jumlah ELSE 0 END) as masuk,
                             SUM(CASE WHEN jenis = 'Pengeluaran' THEN jumlah ELSE 0 END) as keluar
                      FROM transaksi WHERE user_id = :uid AND YEARWEEK(tanggal, 1) = YEARWEEK(CURDATE(), 1)
                      GROUP BY label ORDER BY FIELD(label, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')";
        } else if ($period === '3 Bulan') {
            $query = "SELECT DATE_FORMAT(tanggal, '%b') as label, 
                             SUM(CASE WHEN jenis = 'Pemasukan' THEN jumlah ELSE 0 END) as masuk,
                             SUM(CASE WHEN jenis = 'Pengeluaran' THEN jumlah ELSE 0 END) as keluar
                      FROM transaksi WHERE user_id = :uid AND tanggal >= DATE_SUB(LAST_DAY(CURDATE() - INTERVAL 3 MONTH), INTERVAL 0 DAY)
                      GROUP BY LAST_DAY(tanggal), label ORDER BY LAST_DAY(tanggal)";
        } else if ($period === 'Tahun Ini') {
            $query = "SELECT MONTHNAME(tanggal) as label, 
                             SUM(CASE WHEN jenis = 'Pemasukan' THEN jumlah ELSE 0 END) as masuk,
                             SUM(CASE WHEN jenis = 'Pengeluaran' THEN jumlah ELSE 0 END) as keluar
                      FROM transaksi WHERE user_id = :uid AND YEAR(tanggal) = :tahun
                      GROUP BY label, MONTH(tanggal) ORDER BY MONTH(tanggal)";
        } else {
            // Default: Bulan Ini (dikategori per minggu)
            $query = "SELECT CONCAT('Mg ', WEEK(tanggal) - WEEK(DATE_SUB(tanggal, INTERVAL DAYOFMONTH(tanggal)-1 DAY)) + 1) as label,
                             SUM(CASE WHEN jenis = 'Pemasukan' THEN jumlah ELSE 0 END) as masuk,
                             SUM(CASE WHEN jenis = 'Pengeluaran' THEN jumlah ELSE 0 END) as keluar
                      FROM transaksi WHERE user_id = :uid AND MONTH(tanggal) = :bulan AND YEAR(tanggal) = :tahun
                      GROUP BY label ORDER BY MIN(tanggal)";
        }
        
        $stmt = $this->conn->prepare($query);
        $params = [':uid' => $user_id];
        if (strpos($query, ':bulan') !== false) $params[':bulan'] = $bulan;
        if (strpos($query, ':tahun') !== false) $params[':tahun'] = $tahun;
        $stmt->execute($params);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            'labels' => array_column($data, 'label'),
            'pemasukan' => array_map('floatval', array_column($data, 'masuk')),
            'pengeluaran' => array_map('floatval', array_column($data, 'keluar'))
        ];
    }

    private function getMonthlyComparison($user_id) {
        $query = "SELECT DATE_FORMAT(tanggal, '%b') as label, SUM(jumlah) as total 
                  FROM transaksi WHERE user_id = :uid AND jenis = 'Pengeluaran'
                  GROUP BY LAST_DAY(tanggal), label ORDER BY LAST_DAY(tanggal) DESC LIMIT 4";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':uid' => $user_id]);
        $data = array_reverse($stmt->fetchAll(PDO::FETCH_ASSOC));
        
        return [
            'labels' => array_column($data, 'label'),
            'data' => array_map('floatval', array_column($data, 'total'))
        ];
    }
}