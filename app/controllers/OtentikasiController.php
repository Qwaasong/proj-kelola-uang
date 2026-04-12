<?php
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/JwtHelper.php';
require_once __DIR__ . '/../models/UserModel.php';

class OtentikasiController {
    private $userModel;

    public function __construct() {
        $this->userModel = new UserModel();
    }

    public function daftar() {
        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->username) && !empty($data->password) && !empty($data->confirm_password)) {
             
            // Validasi username
            if(strlen($data->username) < 6) {
                Response::json(400, "error", [
                    'message' => "Username minimal harus terdiri dari 6 karakter!",
                    'field' => 'username'
                ]);
                return;
            }

            // Validasi password
            if(strlen($data->password) < 6) {
                Response::json(400, "error", [
                    'message' => "Password minimal harus terdiri dari 6 karakter!",
                    'field' => 'password'
                ]);
                return;
            }

            // Validasi konfirmasi password
            if($data->password !== $data->confirm_password) {
                Response::json(400, "error", [
                    'message' => "Password dan Konfirmasi Password tidak cocok!",
                    'field' => 'confirm_password'
                ]);
                return;
            }
            
            // Cek username sudah ada
            if($this->userModel->isUsernameExists($data->username)) {
                Response::json(400, "error", [
                    'message' => "Username sudah digunakan!",
                    'field' => 'username'
                ]);
                return;
            }
            
            // Registrasi berhasil
            if($this->userModel->register($data->username, $data->password)) {
                Response::json(201, "success", "Registrasi berhasil! Silakan masuk.");
            } else {
                Response::json(500, "error", "Gagal mendaftarkan pengguna.");
            }
        } else {
            // Error umum: field tidak lengkap
            $missingFields = [];
            if(empty($data->username)) $missingFields[] = 'username';
            if(empty($data->password)) $missingFields[] = 'password';
            if(empty($data->confirm_password)) $missingFields[] = 'confirm_password';
            
            Response::json(400, "error", [
                'message' => "Masukkan Username, Password dan Konfirmasi Password!",
                'fields' => $missingFields
            ]);
        }
    }

    public function masuk() {
        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->username) && !empty($data->password)) {
            $user = $this->userModel->login($data->username, $data->password);
            
            if($user) {
                $token = JwtHelper::generateToken([
                    'id' => $user['id'],
                    'username' => $user['username']
                ]);

                Response::json(200, "success", [
                    "message" => "Berhasil masuk!",
                    "token" => $token,
                    "user" => $user
                ]);

            } else if ($this->userModel->isUsernameExists($data->username)) {
                Response::json(401, "error", [
                    'message' => "Password salah!",
                    'field' => 'password'
                ]);
            } else {
                Response::json(401, "error", [
                    'message' => "Username tidak ditemukan!",
                    'field' => 'username'
                ]);
            }
        } else {
            $missingFields = [];
            if(empty($data->username)) $missingFields[] = 'username';
            if(empty($data->password)) $missingFields[] = 'password';
            
            Response::json(400, "error", [
                'message' => "Masukkan Username dan Password!",
                'fields' => $missingFields
            ]);
        }
    }
}