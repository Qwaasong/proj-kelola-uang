<?php
require_once __DIR__ . '/../app/core/Response.php';
require_once __DIR__ . '/../app/config/database.php';
require_once __DIR__ . '/../app/controllers/AuthController.php'; 
require_once __DIR__ . '/../app/controllers/TransactionController.php'; 
require_once __DIR__ . '/../app/controllers/RecurringController.php'; 
require_once __DIR__ . '/../app/controllers/TargetController.php'; 
require_once __DIR__ . '/../app/controllers/ReportController.php'; // <-- BARU

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$base_path = '/proj-kelola-uang/public'; 
if (strpos($uri, $base_path) === 0) {
    $uri = substr($uri, strlen($base_path));
}

$authController = new AuthController();
$transactionController = new TransactionController(); 
$recurringController = new RecurringController(); 
$targetController = new TargetController(); 
$reportController = new ReportController(); // <-- BARU

if ($uri === '/api/ping' && $method === 'GET') { Response::json(200, "success", "Server berjalan!"); }

if ($uri === '/api/register' && $method === 'POST') { $authController->register(); }
if ($uri === '/api/login' && $method === 'POST') { $authController->login(); }

if ($uri === '/api/transaksi/awal' && $method === 'POST') { $transactionController->addAwal(); }
if ($uri === '/api/transaksi/baru' && $method === 'POST') { $transactionController->addBaru(); }
if ($uri === '/api/transaksi/tabungan' && $method === 'POST') { $transactionController->addTabungan(); } 

if ($uri === '/api/recurring/pemasukan' && $method === 'POST') { $recurringController->addPemasukan(); }
if ($uri === '/api/recurring/pengeluaran' && $method === 'POST') { $recurringController->addPengeluaran(); }

if ($uri === '/api/target' && $method === 'POST') { $targetController->addTarget(); }

// --- BARU: ENDPOINT LAPORAN ---
if ($uri === '/api/laporan/riwayat' && $method === 'POST') { $reportController->history(); exit(); }
if ($uri === '/api/laporan/ringkasan' && $method === 'POST') { $reportController->summary(); exit(); }

Response::json(404, "error", "Endpoint tidak ditemukan. Path yang dibaca server: " . $uri);