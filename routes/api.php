<?php
// Mendapatkan URI dari request
$request_uri = $_SERVER['REQUEST_URI'];

// Menghapus query string jika ada (misal: /api/user?id=1 menjadi /api/user)
$request_uri = explode('?', $request_uri)[0];

// Routing API
switch ($request_uri) {
    case '/api/user':
        require_once '../app/handlers/user_handler.php';
        break;

    case '/api/login':
        require_once '../app/handlers/login_handler.php';
        break;

    // TAHAP 2: Rute untuk Transaksi (Awal, Pemasukan, Pengeluaran, Tabungan)
    case '/api/transaction':
        require_once '../app/handlers/transaction_handler.php';
        break;

    case '/api/target':
        require_once '../app/handlers/target_handler.php';
        break;

    case '/api/recurring':
        require_once '../app/handlers/recurring_handler.php';
        break;

    // Default jika route tidak ditemukan
    default:
        require_once '../app/core/Response.php';
        Response::error(404, "Endpoint tidak ditemukan.");
        break;
}
