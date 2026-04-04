<?php
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../models/UserModel.php';

class AuthController {
    private $userModel;

    public function __construct() {
        $this->userModel = new UserModel();
    }

    public function register() {
        $data = json_decode(file_get_contents("php://input"));

        // Validasi ketersediaan input
        if(!empty($data->username) && !empty($data->password) && !empty($data->confirm_password)) {
            
            // Validasi apakah password & konfirmasi sama
            if($data->password !== $data->confirm_password) {
                Response::json(400, "error", "Password dan Konfirmasi Password tidak cocok!");
            }

            // Cek apakah username sudah terdaftar
            if($this->userModel->isUsernameExists($data->username)) {
                Response::json(400, "error", "Username sudah digunakan!");
            }

            // Lakukan insert
            if($this->userModel->register($data->username, $data->password)) {
                Response::json(201, "success", "Registrasi berhasil! Silakan login.");
            } else {
                Response::json(500, "error", "Gagal mendaftarkan user.");
            }
        } else {
            Response::json(400, "error", "Data tidak lengkap! Masukkan username, password, dan confirm_password.");
        }
    }

    public function login() {
        $data = json_decode(file_get_contents("php://input"));

        // Validasi hanya menggunakan username dan password
        if(!empty($data->username) && !empty($data->password)) {
            
            $user = $this->userModel->login($data->username, $data->password);
            
            if($user) {
                Response::json(200, "success", [
                    "message" => "Login berhasil!",
                    "user" => $user
                ]);
            } else {
                Response::json(401, "error", "Username atau password salah!");
            }
        } else {
            Response::json(400, "error", "Data tidak lengkap! Masukkan username dan password.");
        }
    }
}