<?php

header("Content-Type: application/json");

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../messages/UserMessage.php';
require_once __DIR__ . '/../controllers/UserValidationController.php';
require_once __DIR__ . '/../controllers/UserLogicController.php';
require_once __DIR__ . '/../controllers/UserDataController.php';

$input = json_decode(file_get_contents("php://input"), true);

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
