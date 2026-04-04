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
$base_path = '/proj-kelola-uang/api'; 
if (strpos($uri, $base_path) === 0) $uri = substr($uri, strlen($base_path));

// Inisialisasi Controller Baru
$otentikasi = new OtentikasiController();
$dashboard  = new DashboardController();
$dompet     = new DompetController(); 
$transaksi  = new TransaksiController(); 
$halaman    = new HalamanController();

// === OTENTIKASI ===
if ($uri === '/otentikasi/masuk' && $method === 'POST') { $otentikasi->masuk(); exit(); }
if ($uri === '/otentikasi/daftar' && $method === 'POST') { $otentikasi->daftar(); exit(); }

// === DASHBOARD ===
if ($uri === '/dashboard' && $method === 'GET') { $dashboard->getDashboard(); exit(); }

// === DOMPET ===
if ($uri === '/dompet' && $method === 'GET') { $dompet->getDompet(); exit(); }
if ($uri === '/dompet' && $method === 'POST') { $dompet->addDompet(); exit(); }
if ($uri === '/dompet/transfer' && $method === 'PUT') { $dompet->transferDompet(); exit(); }
if ($uri === '/dompet' && $method === 'DELETE') { $dompet->hapus(); exit(); }

// === TRANSAKSI & KATEGORI ===
if ($uri === '/kategori' && $method === 'GET') { $transaksi->getKategori(); exit(); }
if ($uri === '/transaksi' && $method === 'GET') { $transaksi->getSemua(); exit(); }
if ($uri === '/transaksi' && $method === 'POST') { $transaksi->tambah(); exit(); }
if ($uri === '/transaksi' && $method === 'PUT') { $transaksi->perbarui(); exit(); }
if ($uri === '/transaksi' && $method === 'DELETE') { $transaksi->hapus(); exit(); }

// === DANA DARURAT ===
if ($uri === '/dana-darurat' && $method === 'GET') { $halaman->getDanaDarurat(); exit(); }
if ($uri === '/dana-darurat' && $method === 'POST') { $halaman->setTargetDana(); exit(); }
if ($uri === '/dana-darurat/tambah' && $method === 'PUT') { $halaman->tambahSaldoDana(); exit(); }

// === TARGET FINANSIAL (GOALS) ===
if ($uri === '/target' && $method === 'GET') { $halaman->getTarget(); exit(); }
if ($uri === '/target' && $method === 'POST') { $halaman->tambahTarget(); exit(); }
if ($uri === '/target/tambah' && $method === 'PUT') { $halaman->tambahSaldoTarget(); exit(); }
if ($uri === '/target' && $method === 'DELETE') { $halaman->hapusTarget(); exit(); }

// === LAPORAN ===
if ($uri === '/laporan' && $method === 'GET') { $halaman->getLaporan(); exit(); }

// Jika endpoint tidak ada
Response::json(404, "error", "Endpoint tidak ditemukan!");