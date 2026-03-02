<?php

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (strpos($uri, '/api/') === 0) {
    require_once '../routes/api.php';
} else {
    require_once '../routes/web.php';
}
