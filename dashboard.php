<?php
// File: dashboard.php
// Halaman utama setelah pengguna berhasil login.

// Wajib memulai session untuk mengakses data pengguna yang login.
session_start();

// Memanggil file koneksi database.
require 'utils/connection.php';

// --- PENGAMANAN HALAMAN ---
// Cek apakah pengguna sudah login atau belum.
// Jika tidak ada session 'user_id', artinya belum login.
if (!isset($_SESSION['user_id'])) {
    // Arahkan paksa ke halaman login.
    header("Location: login.php");
    exit();
}

// Ambil user_id dari session untuk digunakan di semua query.
$user_id = $_SESSION['user_id'];

// --- PENGAMBILAN DATA DARI DATABASE ---

// Inisialisasi variabel dengan nilai default untuk mencegah error.
$pemasukan_bulan_ini = 0;
$pengeluaran_bulan_ini = 0;
$total_saldo = 0;
$dana_darurat_saat_ini = 0;
$dana_darurat_target = 1; // Default ke 1 untuk menghindari pembagian dengan nol
$persentase_dana_darurat = 0;
$transaksi_terakhir = [];

// 1. Mengambil Pemasukan & Pengeluaran Bulan Ini
$bulan_ini = date('m');
$tahun_ini = date('Y');
$stmt_monthly = $conn->prepare("SELECT SUM(CASE WHEN transaction_type = 'Pemasukan' THEN amount ELSE 0 END) as total_pemasukan, SUM(CASE WHEN transaction_type = 'Pengeluaran' THEN amount ELSE 0 END) as total_pengeluaran FROM transactions WHERE user_id = ? AND MONTH(transaction_date) = ? AND YEAR(transaction_date) = ?");
$stmt_monthly->bind_param("iis", $user_id, $bulan_ini, $tahun_ini);
$stmt_monthly->execute();
$result_monthly = $stmt_monthly->get_result()->fetch_assoc();
if ($result_monthly) {
    $pemasukan_bulan_ini = $result_monthly['total_pemasukan'] ?? 0;
    $pengeluaran_bulan_ini = $result_monthly['total_pengeluaran'] ?? 0;
}
$stmt_monthly->close();

// 2. Mengambil Total Saldo
$stmt_balance = $conn->prepare("SELECT SUM(current_balance) as total FROM accounts WHERE user_id = ?");
$stmt_balance->bind_param("i", $user_id);
$stmt_balance->execute();
$result_balance = $stmt_balance->get_result()->fetch_assoc();
if ($result_balance) {
    $total_saldo = $result_balance['total'] ?? 0;
}
$stmt_balance->close();

// 3. Mengambil Data Dana Darurat
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

// 4. Mengambil 3 Transaksi Terakhir
$stmt_transactions = $conn->prepare("SELECT t.amount, t.transaction_type, t.transaction_date, c.category_name, c.category_icon FROM transactions t LEFT JOIN categories c ON t.category_id = c.id WHERE t.user_id = ? ORDER BY t.transaction_date DESC LIMIT 3");
$stmt_transactions->bind_param("i", $user_id);
$stmt_transactions->execute();
$transaksi_terakhir = $stmt_transactions->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt_transactions->close();
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
        <a href="logout.php" style="margin-left: auto; color: white; text-decoration: none; padding: 8px 16px; background-color: #e74c3c; border-radius: 5px;">Logout</a>
    </header>

    <main class="main-content">
        <div class="tip-container" aria-label="Tip keuangan">
            <p>Tip: Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad nisi cum qui eligendi, itaque pariatur
                voluptatibus praesentium recusandae quos adipisci deserunt perspiciatis porro impedit, id neque vitae
                odio. Nam, alias!</p>
        </div>

        <section class="statistics">
            <div class="stat-card income">
                <h3 class="stat-card__title">Pemasukan Bulan Ini</h3>
                <p class="stat-card__value">Rp <?php echo number_format($pemasukan_bulan_ini, 0, ',', '.'); ?></p>
                <div class="trend up">
                    <span class="material-symbols-outlined">trending_up</span>
                    <span>12% dari bulan lalu</span>
                </div>
            </div>
            <div class="stat-card expense">
                <h3 class="stat-card__title">Pengeluaran Bulan Ini</h3>
                <p class="stat-card__value">Rp <?php echo number_format($pengeluaran_bulan_ini, 0, ',', '.'); ?></p>
                <div class="trend down">
                    <span class="material-symbols-outlined">trending_down</span>
                    <span>5% dari bulan lalu</span>
                </div>
            </div>
            <div class="stat-card">
                <h3 class="stat-card__title">Total Saldo</h3>
                <p class="stat-card__value">Rp <?php echo number_format($total_saldo, 0, ',', '.'); ?></p>
                <div class="trend up">
                    <span class="material-symbols-outlined">trending_up</span>
                    <span>8% dari bulan lalu</span>
                </div>
            </div>
            <div class="stat-card">
                <h3 class="stat-card__title">Dana Darurat</h3>
                <p class="stat-card__value">Rp <?php echo number_format($dana_darurat_saat_ini, 0, ',', '.'); ?></p>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: <?php echo min(100, $persentase_dana_darurat); ?>%"></div>
                    </div>
                    <span><?php echo round($persentase_dana_darurat, 1); ?>% dari target</span>
                </div>
            </div>
        </section>

        <section class="content-area content-area--01">
            <div class="transactions">
                <h2 class="section-title">Transaksi Terakhir</h2>

                <?php if (empty($transaksi_terakhir)): ?>
                    <div class="transaction-card">
                        <p>Belum ada transaksi untuk ditampilkan.</p>
                    </div>
                <?php else: ?>
                    <?php foreach ($transaksi_terakhir as $trx): ?>
                    <div class="transaction-card">
                        <div class="transaction-info">
                            <div class="category-icon <?php echo strtolower(htmlspecialchars($trx['category_name'] ?? 'default')); ?>">
                                <span class="material-icons"><?php echo htmlspecialchars($trx['category_icon'] ?? 'receipt_long'); ?></span>
                            </div>
                            <div class="transaction-details">
                                <p class="transaction-category"><?php echo htmlspecialchars($trx['category_name'] ?? 'Tanpa Kategori'); ?></p>
                                <p class="transaction-time"><?php echo date('d M Y, H:i', strtotime($trx['transaction_date'])); ?></p>
                            </div>
                        </div>
                        <p class="transaction-amount <?php echo strtolower($trx['transaction_type']); ?>"><?php echo ($trx['transaction_type'] == 'Pengeluaran' ? '-' : '+'); ?> Rp. <?php echo number_format($trx['amount'], 0, ',', '.'); ?></p>
                    </div>
                    <?php endforeach; ?>
                <?php endif; ?>
                
            </div>

            <div class="menu-grid">
                <div class="menu-item" role="button" tabindex="0" aria-label="Tambah pemasukan">
                    <i class="material-icons menu-icon">account_balance_wallet</i>
                    <span class="menu-name">Pemasukan</span>
                </div>
                <div class="menu-item" role="button" tabindex="0" aria-label="Tambah pengeluaran">
                    <i class="material-icons menu-icon">payments</i>
                    <span class="menu-name">Pengeluaran</span>
                </div>
                <div class="menu-item" role="button" tabindex="0" aria-label="Pemasukan berulang">
                    <i class="material-icons menu-icon">autorenew</i>
                    <span class="menu-name">Pemasukan Berulang</span>
                </div>
                <div class="menu-item" role="button" tabindex="0" aria-label="Pengeluaran berulang">
                    <i class="material-icons menu-icon">repeat</i>
                    <span class="menu-name">Pengeluaran Berulang</span>
                </div>
                <div class="menu-item" role="button" tabindex="0" aria-label="Target keuangan">
                    <i class="material-icons menu-icon">flag</i>
                    <span class="menu-name">Target</span>
                </div>
                <div class="menu-item" role="button" tabindex="0" aria-label="Dana darurat">
                    <i class="material-icons menu-icon">emergency</i>
                    <span class="menu-name">Dana Darurat</span>
                </div>
                <div class="menu-item" role="button" tabindex="0" aria-label="Laporan keuangan">
                    <i class="material-icons menu-icon">bar_chart</i>
                    <span class="menu-name">Laporan</span>
                </div>
            </div>
        </section>

        <section class="content-area content-area--02">
            <div class="charts">
                <div class="chart-card">
                    <div class="chart-header">Pemasukan dan Pengeluaran 30 Hari Terakhir</div>
                    <div class="chart-body">
                        <canvas id="statistic30days"></canvas>
                    </div>
                </div>
                <div class="chart-card">
                    <div class="chart-header">Pemasukan dan Pengeluaran 6 Bulan Terakhir</div>
                    <div class="chart-body">
                        <canvas id="statistic6months"></canvas>
                    </div>
                </div>
            </div>

            <div class="transactions">
                <h2 class="section-title">Pengeluaran Terbesar</h2>
                <div class="transaction-card">
                    <div class="transaction-info">
                        <div class="category-icon food">
                            <i class="material-icons">shopping_cart</i>
                        </div>
                        <p class="transaction-category">Belanja Bulanan</p>
                    </div>
                    <p class="transaction-amount">Rp 1.200.000</p>
                </div>
                <div class="transaction-card">
                    <div class="transaction-info">
                        <div class="category-icon food">
                            <i class="material-icons">house</i>
                        </div>
                        <p class="transaction-category">Sewa Rumah</p>
                    </div>
                    <p class="transaction-amount">Rp 1.000.000</p>
                </div>
                <div class="transaction-card">
                    <div class="transaction-info">
                        <div class="category-icon food">
                            <i class="material-icons">two_wheeler</i>
                        </div>
                        <p class="transaction-category">Angsuran Motor</p>
                    </div>
                    <p class="transaction-amount">Rp 800.000</p>
                </div>
            </div>
        </section>
    </main>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.5.0/chart.umd.min.js" crossorigin="anonymous"
        referrerpolicy="no-referrer"></script>
    <script src="public/js/chart-helper.js"></script>
    <script>
        // Data dan inisialisasi chart tetap sama persis seperti frontend asli.
        function initCharts() {
            const cfg1 = {
                labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
                datasets: [
                    { label: 'Pemasukan', data: [10, 20, 30, 15], backgroundColor: 'rgba(31,119,180,0.6)', fill: true },
                    { label: 'Pengeluaran', data: [5, 25, 15, 10], backgroundColor: 'rgba(255,127,14,0.6)', fill: true }
                ]
            };
            
            const cfg2 = {
                labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'],
                datasets: [
                    { label: 'Pemasukan', data: [500, 700, 800, 600, 900, 750], backgroundColor: 'rgba(31,119,180,0.6)' },
                    { label: 'Pengeluaran', data: [300, 400, 500, 450, 600, 550], backgroundColor: 'rgba(255,127,14,0.6)' }
                ]
            };

            const g1 = createGraph('statistic30days', cfg1, {
                type: 'line',
                stacked: false,
                chartJsOptions: {
                    plugins: { legend: { display: true } },
                    elements: { line: { tension: 0.4 } },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { grid: { display: true } },
                        y: { grid: { display: false } }
                    }
                }
            });

            const g2 = createGraph('statistic6months', cfg2, { 
                type: 'bar', 
                stacked: false, 
                chartJsOptions: {
                    responsive: true,
                    maintainAspectRatio: false 
                } 
            });
            
            console.log('Charts initialized with data');
        }

        document.addEventListener('DOMContentLoaded', initCharts);
    </script>
</body>
</html>