<?php

header("Content-Type: application/json");

// Gunakan __DIR__ agar path selalu absolut dan tidak error
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../controllers/TransactionValidationController.php';
require_once __DIR__ . '/../models/TransactionModel.php';

// 1. Pastikan hanya menerima request POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method tidak diizinkan. Gunakan POST.", 405);
}

// 2. Baca data JSON dari Frontend
$data = json_decode(file_get_contents("php://input"), true);
if (empty($data)) {
    $data = $_POST;
}

if (empty($data)) {
    Response::error("Data transaksi tidak boleh kosong.", 400);
}

// 3. Gunakan Try-Catch Global untuk seluruh proses
try {
    // Validasi Input
    $validationError = TransactionValidationController::validate($data);
    if ($validationError) {
        // Menggunakan Response::error dari core kamu
        Response::error($validationError, 400);
    }

    // Simpan ke Database
    $database = new Database();
    
    // Fallback otomatis jika kamu menggunakan connect() atau getConnection() di file database.php
    $db = method_exists($database, 'connect') ? $database->connect() : $database->getConnection();
    
    $model = new TransactionModel($db);

    if ($model->createTransaction($data)) {
        Response::success("Transaksi berhasil dicatat.", null, 201);
    } else {
        Response::error("Gagal mencatat transaksi.", 500);
    }
} catch (Exception $e) {
    Response::error("Terjadi kesalahan server: " . $e->getMessage(), 500);
} catch (Error $e) {
    Response::error("Terjadi kesalahan sistem: " . $e->getMessage(), 500);
}
