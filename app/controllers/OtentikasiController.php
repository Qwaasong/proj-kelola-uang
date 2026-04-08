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
            
            // VALIDASI BARU: Cek minimal karakter username
            if(strlen($data->username) < 6) {
                Response::json(400, "error", "Username minimal harus terdiri dari 3 karakter!");
                return; // Hentikan proses jika gagal validasi
            }

            // VALIDASI BARU: Cek minimal karakter password
            if(strlen($data->password) < 6) {
                Response::json(400, "error", "Password minimal harus terdiri dari 6 karakter!");
                return; // Hentikan proses jika gagal validasi
            }

            if($data->password !== $data->confirm_password) {
                Response::json(400, "error", "Password dan Konfirmasi Password tidak cocok!");
                return;
            }
            
            if($this->userModel->isUsernameExists($data->username)) {
                Response::json(400, "error", "Username sudah digunakan!");
                return;
            }
            
            if($this->userModel->register($data->username, $data->password)) {
                Response::json(201, "success", "Registrasi berhasil! Silakan masuk.");
            } else {
                Response::json(500, "error", "Gagal mendaftarkan pengguna.");
            }
        } else {
            Response::json(400, "error", "Data tidak lengkap!");
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
            } else {
                Response::json(401, "error", "Username atau sandi salah!");
            }
        } else {
            Response::json(400, "error", "Data tidak lengkap!");
        }
    }
}
