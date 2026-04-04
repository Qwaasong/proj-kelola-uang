<?php
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/JwtHelper.php';
require_once __DIR__ . '/../models/DashboardModel.php';

class DashboardController {
    private $dashboardModel;

    public function __construct() {
        $this->dashboardModel = new DashboardModel();
    }

    private function authenticate() {
        $user = JwtHelper::getAuthorizedUser();
        if (!$user) Response::json(401, "error", "Unauthorized! Token JWT tidak valid.");
        return $user;
    }

    public function getDashboard() {
        $user = $this->authenticate(); // WAJIB LOGIN
        
        // Ambil filter bulan & tahun dari URL (jika tidak ada, gunakan bulan ini)
        $bulan = isset($_GET['bulan']) ? $_GET['bulan'] : date('m');
        $tahun = isset($_GET['tahun']) ? $_GET['tahun'] : date('Y');

        // Panggil semua fungsi kalkulasi dari Model
        $total_saldo = $this->dashboardModel->getTotalSaldo($user['id']);
        $summary_bulanan = $this->dashboardModel->getSummaryBulanan($user['id'], $bulan, $tahun);
        $dana_darurat = $this->dashboardModel->getDanaDarurat($user['id']);
        $transaksi_hari_ini = $this->dashboardModel->getTransaksiHariIni($user['id']);
        $chart_kategori = $this->dashboardModel->getChartKategori($user['id'], $bulan, $tahun);
        $grafik_waktu = $this->dashboardModel->getGrafikWaktu($user['id'], $bulan, $tahun);
        $log_transaksi = $this->dashboardModel->getLogTransaksi($user['id'], 3);

        // Bungkus jadi 1 JSON utuh
        Response::json(200, "success", [
            "periode" => [
                "bulan" => $bulan,
                "tahun" => $tahun
            ],
            "total_saldo" => $total_saldo,
            "pemasukan_bulanan" => $summary_bulanan['Pemasukan'],
            "pengeluaran_bulanan" => $summary_bulanan['Pengeluaran'],
            "dana_darurat" => $dana_darurat,
            "transaksi_hari_ini" => $transaksi_hari_ini,
            "distribusi_kategori" => $chart_kategori,
            "grafik_waktu" => $grafik_waktu,
            "log_transaksi" => $log_transaksi
        ]);
    }
}