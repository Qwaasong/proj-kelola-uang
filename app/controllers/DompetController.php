<?php
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/JwtHelper.php';
require_once __DIR__ . '/../models/DompetModel.php';

class DompetController {
    private $dompetModel;

    public function __construct() {
        $this->dompetModel = new DompetModel();
    }

    // Fungsi helper untuk mengecek token JWT
    private function authenticate() {
        $user = JwtHelper::getAuthorizedUser();
        if (!$user) {
            Response::json(401, "error", "Unauthorized! Token JWT tidak valid atau tidak disertakan.");
        }
        return $user; // Mengembalikan array ['id' => ..., 'username' => ...]
    }

    public function getDompet() {
        $user = $this->authenticate(); // WAJIB LOGIN
        $data = $this->dompetModel->getAll($user['id']);
        Response::json(200, "success", $data);
    }

    public function addDompet() {
        $user = $this->authenticate(); // WAJIB LOGIN
        $data = json_decode(file_get_contents("php://input"));

        if(isset($data->nama_dompet) && isset($data->saldo)) {
            if($this->dompetModel->create($user['id'], $data->nama_dompet, $data->saldo)) {
                Response::json(201, "success", "Dompet berhasil ditambahkan!");
            } else {
                Response::json(500, "error", "Gagal menambahkan dompet.");
            }
        } else {
            Response::json(400, "error", "Data tidak lengkap! Butuh: nama_dompet, saldo.");
        }
    }

    public function transferDompet() {
        $user = $this->authenticate(); // WAJIB LOGIN
        $data = json_decode(file_get_contents("php://input"));

        if(isset($data->dari_dompet_id) && isset($data->ke_dompet_id) && isset($data->jumlah)) {
            $result = $this->dompetModel->transfer($user['id'], $data->dari_dompet_id, $data->ke_dompet_id, $data->jumlah);
            
            if($result === true) {
                Response::json(200, "success", "Transfer saldo antar dompet berhasil!");
            } else {
                // Jika error berasal dari model (karena saldo kurang)
                $pesan_error = is_string($result) ? $result : "Gagal memproses transfer.";
                Response::json(400, "error", $pesan_error);
            }
        } else {
            Response::json(400, "error", "Data tidak lengkap! Butuh: dari_dompet_id, ke_dompet_id, jumlah.");
        }
    }
}