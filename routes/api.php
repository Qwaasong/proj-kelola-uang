<?php
// 1. Tambahkan Header CORS di baris paling atas
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// 2. Tangani request OPTIONS (Preflight dari browser Vite)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. Perbaiki Logika Routing agar mengabaikan folder XAMPP
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Ekstrak hanya bagian yang dimulai dari '/api'
$api_endpoint = '';
if (preg_match('/\/api(\/.*)?$/', $request_uri, $matches)) {
    $api_endpoint = '/api' . ($matches[1] ?? '');
} else {
    $api_endpoint = $request_uri;
}

// Hapus slash di akhir jika ada agar seragam
$api_endpoint = rtrim($api_endpoint, '/');

// 4. Routing API menggunakan endpoint yang sudah dibersihkan
switch ($api_endpoint) {
    
    case '/api/user':
        require_once '../app/handlers/user_handler.php';
        break;

    case '/api/login':
        require_once '../app/handlers/login_handler.php';
        break;

    case '/api/transaction':
        require_once '../app/handlers/transaction_handler.php';
        break;

    case '/api/target':
        require_once '../app/handlers/target_handler.php';
        break;

    case '/api/recurring':
        require_once '../app/handlers/recurring_handler.php';
        break;

    case '/api/report':
        require_once '../app/handlers/report_handler.php';
        break;

    case '/api/ai-analyst':
        require_once '../app/handlers/ai_handler.php';
        break;

    default:
        require_once '../app/core/Response.php';
        Response::error(404, "Endpoint API tidak ditemukan. Periksa kembali URL Anda.");
        break;
}
