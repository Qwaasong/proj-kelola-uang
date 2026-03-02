<?php

header("Content-Type: application/json");

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../messages/UserMessage.php';
require_once __DIR__ . '/../controllers/UserLoginValidationController.php';
require_once __DIR__ . '/../controllers/UserLoginLogicController.php';

$input = json_decode(file_get_contents("php://input"), true);

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

// Data is processed and session is set in Logic layer since login doesn't have a Data saving layer.
Response::success("Login berhasil", $process['data'], 200);
