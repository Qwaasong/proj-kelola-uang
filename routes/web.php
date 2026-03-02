<?php

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch ($uri) {
    case '/':
    case '/login':
        require '../public/views/login.php';
        break;

    case '/dashboard':
        require '../app/controllers/DashboardController.php';
        $controller = new DashboardController();
        $controller->index();
        break;

    case '/pemasukan':
        require '../public/views/pemasukan.php';
        break;

    case '/pengeluaran':
        require '../public/views/pengeluaran.php';
        break;

    case '/pemasukan-berulang':
        require '../public/views/pemasukan-berulang.php';
        break;

    case '/pengeluaran-berulang':
        require '../public/views/pengeluaran-berulang.php';
        break;

    case '/register':
        require '../public/views/register.php';
        break;

    case '/logout':
        require '../public/views/logout.php';
        break;

    default:
        http_response_code(404);
        echo "404 Not Found";
        break;
}
