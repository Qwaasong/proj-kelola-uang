<?php
use App\Config\Database;

require_once '../app/config/database.php';
require_once '../app/core/Response.php';
require_once '../app/models/ReportModel.php';

$database = new Database();
$db = $database->getConnection();
$model = new ReportModel($db);

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    Response::error(400, "User ID diperlukan.");
    exit;
}

$filters = [
    'type' => $_GET['type'] ?? null,
    'category_id' => $_GET['category_id'] ?? null,
    'start_date' => $_GET['start_date'] ?? null,
    'end_date' => $_GET['end_date'] ?? null,
];

try {
    $reports = $model->getFilteredTransactions($user_id, $filters);
    Response::success(200, "Laporan berhasil diambil.", $reports);
} catch (Exception $e) {
    Response::error(500, "Gagal mengambil laporan: " . $e->getMessage());
}