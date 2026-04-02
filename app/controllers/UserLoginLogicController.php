<?php

// Panggil JwtHelper
require_once __DIR__ . '/../core/JwtHelper.php';

class UserLoginLogicController
{
    private $model;

    public function __construct($db)
    {
        $this->model = new UserModel($db);
    }

    public function process($data)
    {
        $user = $this->model->getUserByUsername($data['username']);

        if (!$user) {
            return [
                "status" => false,
                "error_code" => "INVALID_CREDENTIALS"
            ];
        }

        if (!password_verify($data['password'], $user['password'])) {
            return [
                "status" => false,
                "error_code" => "INVALID_CREDENTIALS"
            ];
        }

        // --- MENGGUNAKAN JWT TOKEN SEBAGAI PENGGANTI SESSION ---
        
        // 1. Siapkan data yang mau dibungkus di dalam Token
        $payload = [
            "user_id" => $user['id'],
            "username" => $user['username']
        ];

        // 2. Buat Token menggunakan JwtHelper
        $token = JwtHelper::generateToken($payload);

        return [
            "status" => true,
            "data" => [
                "id" => $user['id'],
                "username" => $user['username'],
                "token" => $token // Kirimkan token ini ke frontend
            ]
        ];
    }
}
