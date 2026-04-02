<?php
// Mendapatkan URI dari request
$request_uri = $_SERVER['REQUEST_URI'];

// Menghapus query string jika ada (misal: /api/report?user_id=1 menjadi /api/report)
$request_uri = explode('?', $request_uri)[0];

// Routing API - Menghubungkan URL ke File Handler yang Sesuai
switch ($request_uri) {
    
    // --- FITUR DASAR (AUTH) ---
    case '/api/user':
        require_once '../app/handlers/user_handler.php';
        break;

    case '/api/login':
        require_once '../app/handlers/login_handler.php';
        break;


    // --- TAHAP 2: TRANSAKSI (PEMASUKAN, PENGELUARAN, TABUNGAN) ---
    case '/api/transaction':
        require_once '../app/handlers/transaction_handler.php';
        break;


    // --- TAHAP 3: TARGET FINANSIAL (RENCANA MENABUNG) ---
    case '/api/target':
        require_once '../app/handlers/target_handler.php';
        break;


    // --- TAHAP 4: TRANSAKSI BERULANG (GAJI/TAGIHAN OTOMATIS) ---
    case '/api/recurring':
        require_once '../app/handlers/recurring_handler.php';
        break;


    // --- TAHAP 5: LAPORAN & FILTER RIWAYAT ---
    case '/api/report':
        require_once '../app/handlers/report_handler.php';
        break;


    // --- TAHAP 6: ANALISIS KEUANGAN DENGAN AI (GEMINI) ---
    case '/api/ai-analyst':
        require_once '../app/handlers/ai_handler.php';
        break;


    // --- DEFAULT: JIKA ENDPOINT TIDAK DITEMUKAN ---
    default:
        require_once '../app/core/Response.php';
        Response::error(404, "Endpoint API tidak ditemukan. Periksa kembali URL Anda.");
        break;
}
