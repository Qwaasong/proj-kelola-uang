<?php
use App\Config\Database;

require_once '../app/config/database.php';
require_once '../app/core/Response.php';
require_once '../app/models/TargetModel.php';

$database = new Database();
$db = $database->getConnection();
$model = new TargetModel($db);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if ($model->createTarget($data)) {
        Response::success(201, "Target finansial berhasil dibuat.");
    } else {
        Response::error(500, "Gagal membuat target.");
    }
} elseif ($method === 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    if (!$user_id) {
        Response::error(400, "User ID wajib disertakan.");
        exit;
    }
    $targets = $model->getTargetsWithProgress($user_id);
    Response::success(200, "Data target berhasil diambil.", $targets);
}