<?php
require_once '../app/config/database.php';
require_once '../app/core/Response.php';
require_once '../app/controllers/TransactionValidationController.php';
require_once '../app/models/TransactionModel.php';

// Ambil data JSON dari Frontend
$data = json_decode(file_get_contents("php://input"), true);

// 1. Validasi Input
$validationError = TransactionValidationController::validate($data);
if ($validationError) {
    Response::error(400, $validationError);
    exit;
}

// 2. Simpan ke Database
try {
    $database = new Database();
    $db = $database->getConnection();
    $model = new TransactionModel($db);

    if ($model->createTransaction($data)) {
        Response::success(201, "Transaksi berhasil dicatat.");
    } else {
        Response::error(500, "Gagal mencatat transaksi.");
    }
} catch (Exception $e) {
    Response::error(500, "Terjadi kesalahan server: " . $e->getMessage());
}