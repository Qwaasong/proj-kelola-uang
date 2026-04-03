<?php

header("Content-Type: application/json");

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/AuthMiddleware.php'; // <-- Panggil Middleware di sini
require_once __DIR__ . '/../controllers/TransactionValidationController.php';
require_once __DIR__ . '/../models/TransactionModel.php';

// 1. Pastikan hanya menerima request POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method tidak diizinkan. Gunakan POST.", 405);
}

// 2. JALANKAN SATPAM (MIDDLEWARE)
// Jika token tidak valid, kode akan otomatis terhenti di sini dan mengirim response error 401.
// Jika valid, kita simpan data usernya (id, username) ke variabel $loggedInUser
$loggedInUser = AuthMiddleware::authenticate();

// 3. Baca data JSON dari Frontend
$data = json_decode(file_get_contents("php://input"), true);
if (empty($data)) {
    $data = $_POST;
}

if (empty($data)) {
    Response::error("Data transaksi tidak boleh kosong.", 400);
}

// Opsional tapi penting: Pastikan ID User yang masuk ke database adalah ID milik user yang sedang login (bukan dari inputan frontend yang bisa dimanipulasi)
$data['user_id'] = $loggedInUser['user_id']; 

// 4. Gunakan Try-Catch Global
try {
    // Validasi Input
    $validationError = TransactionValidationController::validate($data);
    if ($validationError) {
        Response::error($validationError, 400);
    }

    // Simpan ke Database
    $database = new Database();
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
