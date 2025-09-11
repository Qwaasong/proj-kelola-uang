<?php
// File: dashboard.php
// Halaman utama setelah pengguna berhasil login.

session_start();
require 'utils/connection.php';

// Keamanan: Pastikan pengguna sudah login.
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}
$user_id = $_SESSION['user_id'];
$username = $_SESSION['username']; // Ambil username dari session

// --- PENGAMBILAN DATA DINAMIS DARI DATABASE ---

// 1. Data untuk 4 Kartu Statistik Teratas
$pemasukan_bulan_ini = 0;
$pengeluaran_bulan_ini = 0;
$total_saldo = 0;
$dana_darurat_saat_ini = 0;
$dana_darurat_target = 1; // Default 1 untuk hindari pembagian dengan nol
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
// Query ini akan mengambil total pemasukan dan pengeluaran per hari selama 30 hari terakhir
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

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard | Kelola Uang</title>
    <link rel="stylesheet" href="public/css/dashboard-style.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Icons">
</head>

<body>
    <header class="header">
        <img src="public/asset/Logo-Icons.png" alt="Kelola Uang Logo" class="header__logo">
        <div style="margin-left: auto; display: flex; align-items: center; gap: 15px;">
            <span style="color: white;">Selamat Datang, <strong><?php echo htmlspecialchars($username); ?>!</strong></span>
            <a href="logout.php" style="color: white; text-decoration: none; padding: 8px 12px; background-color: #e74c3c; border-radius: 6px;">Logout</a>
        </div>
    </header>

    <main class="main-content">
        <div class="tip-container" aria-label="Tip keuangan">
            <p>Tip: Rencanakan pengeluaran Anda di awal bulan untuk menghindari pemborosan.</p>
        </div>

        <section class="statistics">
            <div class="stat-card income">
                <div class="stat-card__header">
                    <h3 class="stat-card__title">Pemasukan</h3>
                </div>
                <div class="stat-card__body">
                    <div class="stat-card__main-value">
                        <p class="stat-card__value"><?php echo 'Rp ' . number_format($pemasukan_bulan_ini, 0, ',', '.'); ?></p>
                        <p class="stat-card__subtext">dalam 30 hari terakhir</p>
                    </div>
                </div>
            </div>
            <div class="stat-card expense">
                <div class="stat-card__header">
                    <h3 class="stat-card__title">Pengeluaran</h3>
                </div>
                <div class="stat-card__body">
                    <div class="stat-card__main-value">
                        <p class="stat-card__value"><?php echo 'Rp ' . number_format($pengeluaran_bulan_ini, 0, ',', '.'); ?></p>
                        <p class="stat-card__subtext">dalam 30 hari terakhir</p>
                    </div>
                </div>
            </div>
            <div class="stat-card balance">
                <div class="stat-card__header">
                    <h3 class="stat-card__title">Total Saldo</h3>
                </div>
                <div class="stat-card__body">
                    <div class="stat-card__main-value">
                        <p class="stat-card__value"><?php echo 'Rp ' . number_format($total_saldo, 0, ',', '.'); ?></p>
                        <p class="stat-card__subtext">di semua akun</p>
                    </div>
                </div>
            </div>
            <div class="stat-card emergency">
                <div class="stat-card__header">
                    <h3 class="stat-card__title">Dana Darurat</h3>
                </div>
                <div class="stat-card__body">
                    <div class="stat-card__main-value">
                        <p class="stat-card__value"><?php echo 'Rp ' . number_format($dana_darurat_saat_ini, 0, ',', '.'); ?></p>
                        <p class="stat-card__subtext">dari target <?php echo 'Rp ' . number_format($dana_darurat_target, 0, ',', '.'); ?></p>
                    </div>
                    <div class="stat-card__chart">
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: <?php echo min(100, $persentase_dana_darurat); ?>%"></div>
                            </div>
                            <span><?php echo round($persentase_dana_darurat); ?>%</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="content-area content-area--01">
            <div class="menu-grid">
                <div class="menu-item" role="button" tabindex="0"><i class="material-icons menu-icon">account_balance_wallet</i><span class="menu-name">Pemasukan</span></div>
                <div class="menu-item" role="button" tabindex="0"><i class="material-icons menu-icon">payments</i><span class="menu-name">Pengeluaran</span></div>
                <div class="menu-item" role="button" tabindex="0"><i class="material-icons menu-icon">autorenew</i><span class="menu-name">Pemasukan Berulang</span></div>
                <div class="menu-item" role="button" tabindex="0"><i class="material-icons menu-icon">repeat</i><span class="menu-name">Pengeluaran Berulang</span></div>
                <div class="menu-item" role="button" tabindex="0"><i class="material-icons menu-icon">flag</i><span class="menu-name">Target</span></div>
                <div class="menu-item" role="button" tabindex="0"><i class="material-icons menu-icon">emergency</i><span class="menu-name">Dana Darurat</span></div>
                <div class="menu-item" role="button" tabindex="0"><i class="material-icons menu-icon">bar_chart</i><span class="menu-name">Laporan</span></div>
            </div>

            <div class="content-wrapper">
                <div class="transactions-section">
                    <div class="transactions">
                        <h2 class="section-title">Transaksi Terakhir</h2>
                        <?php if (empty($transaksi_terakhir)): ?>
                            <p>Belum ada transaksi.</p>
                        <?php else: ?>
                            <?php foreach ($transaksi_terakhir as $trx): ?>
                                <div class="transaction-card">
                                    <div class="transaction-info">
                                        <div class="category-icon" style="background-color: #eee"><span class="material-icons"><?php echo htmlspecialchars($trx['category_icon'] ?? 'help'); ?></span></div>
                                        <div class="transaction-details">
                                            <p class="transaction-category"><?php echo htmlspecialchars($trx['category_name'] ?? 'Tanpa Kategori'); ?></p>
                                            <p class="transaction-time"><?php echo date('d M, H:i', strtotime($trx['transaction_date'])); ?></p>
                                        </div>
                                    </div>
                                    <p class="transaction-amount <?php echo strtolower($trx['transaction_type']); ?>"><?php echo 'Rp. ' . number_format($trx['amount'], 0, ',', '.'); ?></p>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>

                <div class="transactions-section">
                    <div class="transactions" style="border-width: 1px 0px 1px 0px;">
                        <h2 class="section-title">Pengeluaran Terbesar</h2>
                        <?php if (empty($pengeluaran_terbesar)): ?>
                            <p>Belum ada pengeluaran.</p>
                        <?php else: ?>
                            <?php foreach ($pengeluaran_terbesar as $expense): ?>
                                <div class="transaction-card">
                                    <div class="transaction-info">
                                        <div class="category-icon" style="background-color: #eee"><i class="material-icons"><?php echo htmlspecialchars($expense['category_icon'] ?? 'help'); ?></i></div>
                                        <div class="transaction-details">
                                            <p class="transaction-category"><?php echo htmlspecialchars($expense['category_name'] ?? 'Tanpa Kategori'); ?></p>
                                        </div>
                                    </div>
                                    <p class="transaction-amount expense"><?php echo 'Rp ' . number_format($expense['amount'], 0, ',', '.'); ?></p>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </section>

        <section class="content-area content-area--02">
            <div class="chart-section">
                <div class="chart-card">
                    <div class="chart-header">
                        <div class="chart-header__title">
                            <h3>Transaksi</h3>
                            <p>Pemasukan dan Pengeluaran</p>
                        </div>
                    </div>
                    <div class="chart-container-wrapper">
                        <div class="chart-labels">
                            <div class="chart-label"><div class="chart-label-dot income"></div><span class="chart-label-text">Pemasukan</span></div>
                            <div class="chart-label"><div class="chart-label-dot expense"></div><span class="chart-label-text">Pengeluaran</span></div>
                        </div>
                        <div class="chart-container">
                            <canvas id="combinedChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.5.0/chart.umd.min.js"></script>
    <script src="public/js/format-helper.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Data dinamis dari PHP untuk chart
            const chartData = {
                labels: <?php echo json_encode($chart_labels); ?>,
                datasets: [
                    { 
                        label: 'Pemasukan', 
                        data: <?php echo json_encode($chart_pemasukan); ?>, 
                        borderColor: 'rgba(31, 119, 180, 1)',
                        backgroundColor: 'rgba(31, 119, 180, 0.6)',
                        fill: true,
                        tension: 0.4
                    },
                    { 
                        label: 'Pengeluaran', 
                        data: <?php echo json_encode($chart_pengeluaran); ?>, 
                        borderColor: 'rgba(255, 127, 14, 1)',
                        backgroundColor: 'rgba(255, 127, 14, 0.6)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            };

            const chartConfig = {
                type: 'line', // Mengganti tipe chart ke 'line' agar lebih sesuai
                data: chartData,
                options: withFormattedAxes({
                    plugins: { legend: { display: false } },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { grid: { display: false } },
                        y: { grid: { display: true } }
                    }
                })
            };

            const combinedChartCtx = document.getElementById('combinedChart').getContext('2d');
            new Chart(combinedChartCtx, chartConfig);
        });
    </script>

</body>

</html>