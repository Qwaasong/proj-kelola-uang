<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../app/core/Response.php';

// Menangkap semua error ringan (Warning, Notice, Deprecated)
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    Response::error("System Error: " . $errstr . " in " . basename($errfile) . " line " . $errline, 500);
});

// Menangkap semua error berat (Fatal Error, Uncaught Exception)
set_exception_handler(function($exception) {
    Response::error("Server Error: " . $exception->getMessage(), 500);
});

$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$api_endpoint = '';
if (preg_match('/\/api(\/.*)?$/', $request_uri, $matches)) {
    $api_endpoint = '/api' . ($matches[1] ?? '');
} else {
    $api_endpoint = $request_uri;
}

$api_endpoint = rtrim($api_endpoint, '/');

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
        Response::error("Endpoint API tidak ditemukan. Periksa kembali URL Anda.", 404);
        break;
}
