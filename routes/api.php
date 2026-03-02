<?php

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch ($uri) {
    case '/api/user':
        require '../app/handlers/user_handler.php';
        break;

    case '/api/login':
        require '../app/handlers/login_handler.php';
        break;

    default:
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(["status" => false, "message" => "API endpoints not found"]);
        break;
}
