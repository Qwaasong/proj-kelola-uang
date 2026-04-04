<?php
require_once __DIR__ . '/../app/core/Response.php';
require_once __DIR__ . '/../app/config/database.php';
require_once __DIR__ . '/../app/controllers/OtentikasiController.php'; 
require_once __DIR__ . '/../app/controllers/DashboardController.php';
require_once __DIR__ . '/../app/controllers/DompetController.php'; 
require_once __DIR__ . '/../app/controllers/TransaksiController.php'; 
require_once __DIR__ . '/../app/controllers/HalamanController.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];
$base_path = '/proj-kelola-uang/public'; 
if (strpos($uri, $base_path) === 0) $uri = substr($uri, strlen($base_path));

// Inisialisasi Controller Baru
$otentikasi = new OtentikasiController();
$dashboard  = new DashboardController();
$dompet     = new DompetController(); 
$transaksi  = new TransaksiController(); 
$halaman    = new HalamanController();

// === OTENTIKASI ===
if ($uri === '/api/otentikasi/masuk' && $method === 'POST') { $otentikasi->masuk(); exit(); }
if ($uri === '/api/otentikasi/daftar' && $method === 'POST') { $otentikasi->daftar(); exit(); }

// === DASHBOARD ===
if ($uri === '/api/dashboard' && $method === 'GET') { $dashboard->getDashboard(); exit(); }

// === DOMPET ===
if ($uri === '/api/dompet' && $method === 'GET') { $dompet->getDompet(); exit(); }
if ($uri === '/api/dompet' && $method === 'POST') { $dompet->addDompet(); exit(); }
if ($uri === '/api/dompet/transfer' && $method === 'PUT') { $dompet->transferDompet(); exit(); }
if ($uri === '/api/dompet' && $method === 'DELETE') { $dompet->hapus(); exit(); }

// === TRANSAKSI & KATEGORI ===
if ($uri === '/api/kategori' && $method === 'GET') { $transaksi->getKategori(); exit(); }
if ($uri === '/api/transaksi' && $method === 'GET') { $transaksi->getSemua(); exit(); }
if ($uri === '/api/transaksi' && $method === 'POST') { $transaksi->tambah(); exit(); }
if ($uri === '/api/transaksi' && $method === 'PUT') { $transaksi->perbarui(); exit(); }
if ($uri === '/api/transaksi' && $method === 'DELETE') { $transaksi->hapus(); exit(); }

// === DANA DARURAT ===
if ($uri === '/api/dana-darurat' && $method === 'GET') { $halaman->getDanaDarurat(); exit(); }
if ($uri === '/api/dana-darurat' && $method === 'POST') { $halaman->setTargetDana(); exit(); }
if ($uri === '/api/dana-darurat/tambah' && $method === 'PUT') { $halaman->tambahSaldoDana(); exit(); }

// === TARGET FINANSIAL (GOALS) ===
if ($uri === '/api/target' && $method === 'GET') { $halaman->getTarget(); exit(); }
if ($uri === '/api/target' && $method === 'POST') { $halaman->tambahTarget(); exit(); }
if ($uri === '/api/target/tambah' && $method === 'PUT') { $halaman->tambahSaldoTarget(); exit(); }
if ($uri === '/api/target' && $method === 'DELETE') { $halaman->hapusTarget(); exit(); }

// === LAPORAN ===
if ($uri === '/api/laporan' && $method === 'GET') { $halaman->getLaporan(); exit(); }

// Jika endpoint tidak ada
Response::json(404, "error", "Endpoint tidak ditemukan!");