<?php
require_once __DIR__ . '/../core/JwtHelper.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../../vendor/autoload.php';

class ReportController {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function exportPdf() {
        $userData = JwtHelper::getAuthorizedUser();

        if (!$userData) { 
            return Response::json(401, 'Unauthorized', "Sesi tidak valid atau token kosong."); 
        }
        
        $userId = $userData['id'];
        $startDate = $_GET['start_date'] ?? date('Y-m-01');
        $endDate = $_GET['end_date'] ?? date('Y-m-t');

        try {
            // 1. Summary Pemasukan & Pengeluaran
            $stmt = $this->db->prepare("SELECT SUM(CASE WHEN jenis='Pemasukan' THEN jumlah ELSE 0 END) as in_tot, SUM(CASE WHEN jenis='Pengeluaran' THEN jumlah ELSE 0 END) as out_tot FROM transaksi WHERE user_id=? AND tanggal BETWEEN ? AND ?");
            $stmt->execute([$userId, $startDate, $endDate]);
            $sum = $stmt->fetch(PDO::FETCH_ASSOC);
            $totalPemasukan = $sum['in_tot'] ?? 0;
            $totalPengeluaran = $sum['out_tot'] ?? 0;

            // 2. Data Dompet Lengkap
            $stmtDompet = $this->db->prepare("SELECT nama_dompet, saldo FROM dompet WHERE user_id=?");
            $stmtDompet->execute([$userId]);
            $dompetData = $stmtDompet->fetchAll(PDO::FETCH_ASSOC);
            $totalSaldoDompet = array_sum(array_column($dompetData, 'saldo'));

            // 3. Data Dana Darurat
            $stmtDana = $this->db->prepare("SELECT jumlah_target, jumlah_terkumpul FROM dana_darurat WHERE user_id=?");
            $stmtDana->execute([$userId]);
            $danaDarurat = $stmtDana->fetch(PDO::FETCH_ASSOC);

            // 4. Data Goals / Target Finansial
            $stmtGoals = $this->db->prepare("SELECT nama_target, jumlah_target, terkumpul FROM target_finansial WHERE user_id=?");
            $stmtGoals->execute([$userId]);
            $goalsData = $stmtGoals->fetchAll(PDO::FETCH_ASSOC);

            // 5. Data Riwayat Transaksi
            $stmtTrans = $this->db->prepare("SELECT t.*, k.nama_kategori, d.nama_dompet FROM transaksi t LEFT JOIN kategori k ON t.kategori_id=k.id LEFT JOIN dompet d ON t.dompet_id=d.id WHERE t.user_id=? AND t.tanggal BETWEEN ? AND ? ORDER BY t.tanggal ASC");
            $stmtTrans->execute([$userId, $startDate, $endDate]);
            $transaksiData = $stmtTrans->fetchAll(PDO::FETCH_ASSOC);

            // Render HTML ke PDF
            ob_start();
            include __DIR__ . '/../views/pdf_template.php';
            $html = ob_get_clean();

            $mpdf = new \Mpdf\Mpdf([
                'format' => 'A4',
                'margin_left' => 15,
                'margin_right' => 15,
                'margin_top' => 20,
                'margin_bottom' => 20,
                'default_font' => 'helvetica'
            ]);
            
            // Pengaturan Header & Footer PDF
            $mpdf->SetHeader('Laporan Keuangan Pribadi||Periode: ' . $startDate . ' s/d ' . $endDate);
            $mpdf->SetFooter('Dicetak otomatis oleh Sistem Uangmu||Halaman {PAGENO} dari {nbpg}');

            $mpdf->WriteHTML($html);
            $mpdf->Output('Laporan_Keuangan_Uangmu.pdf', \Mpdf\Output\Destination::DOWNLOAD);

        } catch (Exception $e) {
            Response::json(500, "error", "Gagal generate PDF: " . $e->getMessage());
        }
    }
}