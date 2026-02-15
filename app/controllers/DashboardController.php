<?php

class DashboardController
{

    public function index()
    {
        require '../utils/connection.php';

        session_start();

        // Keamanan: Pastikan pengguna sudah login.
        if (!isset($_SESSION['user_id'])) {
            header("Location: /login");
            exit();
        }
        $user_id = $_SESSION['user_id'];
        $username = $_SESSION['username'];

        // --- PENGAMBILAN DATA DINAMIS DARI DATABASE ---

        // 1. Data untuk 4 Kartu Statistik Teratas
        $pemasukan_bulan_ini = 0;
        $pengeluaran_bulan_ini = 0;
        $total_saldo = 0;
        $dana_darurat_saat_ini = 0;
        $dana_darurat_target = 1;
        $persentase_dana_darurat = 0;

        $bulan_ini = date('m');
        $tahun_ini = date('Y');

        // Query untuk Pemasukan & Pengeluaran bulan ini
        $stmt_monthly = $conn->prepare("SELECT SUM(CASE WHEN transaction_type = 'Pemasukan' THEN amount ELSE 0 END) as total_pemasukan, SUM(CASE WHEN transaction_type = 'Pengeluaran' THEN amount ELSE 0 END) as total_pengeluaran FROM transactions WHERE user_id = ? AND MONTH(transaction_date) = ? AND YEAR(transaction_date) = ?");
        $stmt_monthly->bind_param("iis", $user_id, $bulan_ini, $tahun_ini);
        $stmt_monthly->execute();
        $result_monthly = $stmt_monthly->get_result()->fetch_assoc();
        if ($result_monthly) {
            $pemasukan_bulan_ini = $result_monthly['total_pemasukan'] ?? 0;
            $pengeluaran_bulan_ini = $result_monthly['total_pengeluaran'] ?? 0;
        }
        $stmt_monthly->close();

        // Query untuk Total Saldo dari semua akun
        $stmt_balance = $conn->prepare("SELECT SUM(current_balance) as total FROM accounts WHERE user_id = ?");
        $stmt_balance->bind_param("i", $user_id);
        $stmt_balance->execute();
        $result_balance = $stmt_balance->get_result()->fetch_assoc();
        if ($result_balance) {
            $total_saldo = $result_balance['total'] ?? 0;
        }
        $stmt_balance->close();

        // Query untuk Dana Darurat
        $stmt_emergency = $conn->prepare("SELECT current_amount, target_amount FROM emergency_fund WHERE user_id = ?");
        $stmt_emergency->bind_param("i", $user_id);
        $stmt_emergency->execute();
        $result_emergency = $stmt_emergency->get_result()->fetch_assoc();
        if ($result_emergency) {
            $dana_darurat_saat_ini = $result_emergency['current_amount'];
            $dana_darurat_target = $result_emergency['target_amount'] > 0 ? $result_emergency['target_amount'] : 1;
            $persentase_dana_darurat = ($dana_darurat_saat_ini / $dana_darurat_target) * 100;
        }
        $stmt_emergency->close();

        // 2. Data untuk Transaksi Terakhir (3 transaksi)
        $transaksi_terakhir = [];
        $stmt_transactions = $conn->prepare("SELECT t.amount, t.transaction_type, t.transaction_date, c.category_name, c.category_icon FROM transactions t LEFT JOIN categories c ON t.category_id = c.id WHERE t.user_id = ? ORDER BY t.transaction_date DESC LIMIT 3");
        $stmt_transactions->bind_param("i", $user_id);
        $stmt_transactions->execute();
        $transaksi_terakhir = $stmt_transactions->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt_transactions->close();

        // 3. Data untuk Pengeluaran Terbesar (3 transaksi)
        $pengeluaran_terbesar = [];
        $stmt_expenses = $conn->prepare("SELECT t.amount, c.category_name, c.category_icon FROM transactions t LEFT JOIN categories c ON t.category_id = c.id WHERE t.user_id = ? AND t.transaction_type = 'Pengeluaran' ORDER BY t.amount DESC LIMIT 3");
        $stmt_expenses->bind_param("i", $user_id);
        $stmt_expenses->execute();
        $pengeluaran_terbesar = $stmt_expenses->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt_expenses->close();

        // 4. Data untuk Grafik (Contoh: 30 hari terakhir)
        $chart_labels = [];
        $chart_pemasukan = [];
        $chart_pengeluaran = [];
        $stmt_chart = $conn->prepare("SELECT DATE(transaction_date) as tanggal, SUM(CASE WHEN transaction_type = 'Pemasukan' THEN amount ELSE 0 END) as total_pemasukan, SUM(CASE WHEN transaction_type = 'Pengeluaran' THEN amount ELSE 0 END) as total_pengeluaran FROM transactions WHERE user_id = ? AND transaction_date >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY tanggal ORDER BY tanggal ASC");
        $stmt_chart->bind_param("i", $user_id);
        $stmt_chart->execute();
        $result_chart = $stmt_chart->get_result();
        while ($row = $result_chart->fetch_assoc()) {
            $chart_labels[] = date('d M', strtotime($row['tanggal']));
            $chart_pemasukan[] = $row['total_pemasukan'];
            $chart_pengeluaran[] = $row['total_pengeluaran'];
        }
        $stmt_chart->close();

        // Akhirnya, tampilkan view
        require '../app/views/dashboard.php';
    }
}
