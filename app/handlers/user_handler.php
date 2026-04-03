<?php

header("Content-Type: application/json");

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../messages/UserMessage.php';
require_once __DIR__ . '/../controllers/UserValidationController.php';
require_once __DIR__ . '/../controllers/UserLogicController.php';
require_once __DIR__ . '/../controllers/UserDataController.php';

// 1. Pastikan hanya menerima request POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method tidak diizinkan. Gunakan POST.", 405);
}

// 2. Baca data input JSON atau form URL-encoded (Fallback)
$input = json_decode(file_get_contents("php://input"), true);
if (empty($input)) {
    $input = $_POST;
}

if (empty($input)) {
    Response::error("Data input tidak boleh kosong.", 400);
}

// 3. Gunakan Try-Catch Global
try {
    $db = (new Database())->connect();

    // VALIDATION
    $validation = new UserValidationController();
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
    $logic = new UserLogicController($db);
    $process = $logic->process($input);

    if (!$process['status']) {
        $message = UserMessage::error($process['error_code']);
        Response::error($message, 400);
    }

    // DATA
    $dataController = new UserDataController($db);
    $result = $dataController->store($process['data']);

    if (!$result['status']) {
        Response::error("Gagal menyimpan data", 500);
    }

    Response::success(UserMessage::text("CREATED"), null, 201);

} catch (Exception $e) {
    Response::error("Terjadi kesalahan pada server: " . $e->getMessage(), 500);
} catch (Error $e) {
    Response::error("Terjadi kesalahan sistem: " . $e->getMessage(), 500);
}
