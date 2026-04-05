<?php
require_once __DIR__ . '/../app/core/Env.php';
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];
$base_path = Env::get('API_BASE_PATH', '/proj-kelola-uang/api'); 

// Normalisasi URI: Hapus subfolder/prefix API untuk pencocokan route
if (str_starts_with($uri, $base_path)) {
    $uri = substr($uri, strlen($base_path));
} elseif (PHP_SAPI === 'cli-server' && str_starts_with($uri, '/api')) {
    $uri = substr($uri, 4); // Hapus '/api'
}

// === DEBUGGER ===
if (Env::get('APP_ENV') === 'development' || Env::get('APP_DEBUG') === 'true') {
    if (str_contains($_SERVER['REQUEST_URI'], 'debug_info') || !str_contains($uri, '/')) {
        // Biarkan lolos untuk debugger
    }
}

require_once __DIR__ . '/../app/core/Response.php';
require_once __DIR__ . '/../app/config/database.php';
require_once __DIR__ . '/../app/controllers/OtentikasiController.php'; 
require_once __DIR__ . '/../app/controllers/DashboardController.php';
require_once __DIR__ . '/../app/controllers/DompetController.php'; 
require_once __DIR__ . '/../app/controllers/TransaksiController.php'; 
require_once __DIR__ . '/../app/controllers/HalamanController.php';

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
if ($uri === '/dompet' && $method === 'PUT') { $dompet->editDompet(); exit(); }
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

// === EXPORT PDF (ROUTE BARU) ===
if ($uri === '/laporan/export-pdf' && $method === 'GET') { 
    require_once __DIR__ . '/../app/controllers/ReportController.php';
    (new ReportController())->exportPdf(); 
    exit(); 
}

// Jika endpoint tidak ada
if (Env::get('APP_ENV') === 'development' || Env::get('APP_DEBUG') === 'true') {
    Response::json(200, "debug_info", [
        "message" => "Uangmu API Debugger - Endpoint tidak ditemukan atau mode debug aktif.",
        "request" => [
            "uri_normalized" => $uri,
            "uri_raw" => $_SERVER['REQUEST_URI'],
            "method" => $method,
            "query" => $_GET,
            "body" => json_decode(file_get_contents('php://input'), true),
            "headers" => getallheaders()
        ],
        "environment" => [
            "app_env" => Env::get('APP_ENV'),
            "php_sapi" => PHP_SAPI,
            "api_base_config" => $base_path
        ]
    ]);
    exit();
}

Response::json(404, "error", "Endpoint tidak ditemukan!");