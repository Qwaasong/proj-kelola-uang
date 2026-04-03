<?php

header("Content-Type: application/json");

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../messages/UserMessage.php';
require_once __DIR__ . '/../controllers/UserLoginValidationController.php';
require_once __DIR__ . '/../controllers/UserLoginLogicController.php';

// 1. Pastikan hanya menerima request POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method tidak diizinkan. Gunakan POST.", 405);
}

// 2. Baca data input JSON atau form URL-encoded (Fallback)
$input = json_decode(file_get_contents("php://input"), true);
if (empty($input)) {
    $input = $_POST; // Fallback jika menggunakan form-data biasa
}

if (empty($input)) {
    Response::error("Data input tidak boleh kosong.", 400);
}

// 3. Gunakan Try-Catch agar jika ada error server, tetap mengembalikan JSON
try {
    $db = (new Database())->connect();

    // VALIDATION
    $validation = new UserLoginValidationController();
    $validate = $validation->validate($input);

    if (!$validate['status']) {
        $message = UserMessage::error(
            $validate['error_code'],
            $validate['field'] ?? null,
            $validate['value'] ?? null
        );
        Response::error($message, 400);
    }

    // LOGIC
    $logic = new UserLoginLogicController($db);
    $process = $logic->process($input);

    if (!$process['status']) {
        $message = UserMessage::error($process['error_code']);
        Response::error($message, 401);
    }

    // Data is processed and session is set in Logic layer
    Response::success("Login berhasil", $process['data'], 200);

} catch (Exception $e) {
    // Tangkap error fatal (misal database mati) dan kembalikan sebagai format JSON
    Response::error("Terjadi kesalahan pada server: " . $e->getMessage(), 500);
} catch (Error $e) {
    // Tangkap error syntax / fatal error PHP
    Response::error("Terjadi kesalahan sistem: " . $e->getMessage(), 500);
}
