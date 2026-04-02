<?php
use App\Config\Database;

require_once '../app/config/database.php';
require_once '../app/core/Response.php';
require_once '../app/models/RecurringModel.php';

$data = json_decode(file_get_contents("php://input"), true);
$database = new Database();
$db = $database->getConnection();
$model = new RecurringModel($db);

$type = $_GET['type'] ?? ''; 

try {
    if ($type === 'pemasukan') {
        $model->createRecurringPemasukan($data);
        Response::success(201, "Pemasukan berulang berhasil diatur.");
    } elseif ($type === 'pengeluaran') {
        $model->createRecurringPengeluaran($data);
        Response::success(201, "Pengeluaran berulang berhasil diatur.");
    } else {
        Response::error(400, "Tipe transaksi berulang tidak valid.");
    }
} catch (Exception $e) {
    Response::error(500, "Gagal menyimpan: " . $e->getMessage());
}