<?php

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Jika aplikasi dijalankan di subfolder (seperti /proj-kelola-uang/public/), 
// kita perlu membersihkan URI agar routing tetap bekerja.
// Untuk saat ini kita asumsikan root adalah /

switch ($uri) {
    case '/':
    case '/login':
        require '../app/views/login.php';
        break;

    case '/dashboard':
        require '../app/controllers/DashboardController.php';
        $controller = new DashboardController();
        $controller->index();
        break;

    case '/pemasukan':
        require '../app/views/pemasukan.php';
        break;

    case '/pengeluaran':
        require '../app/views/pengeluaran.php';
        break;

    case '/pemasukan-berulang':
        require '../app/views/pemasukan-berulang.php';
        break;

    case '/pengeluaran-berulang':
        require '../app/views/pengeluaran-berulang.php';
        break;

    case '/register':
        require '../app/views/register.php';
        break;

    case '/logout':
        require '../app/views/logout.php';
        break;

    default:
        http_response_code(404);
        echo "404 Not Found";
        break;
}
