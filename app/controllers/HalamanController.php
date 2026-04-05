<?php
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/JwtHelper.php';
require_once __DIR__ . '/../models/DanaDaruratModel.php';
require_once __DIR__ . '/../models/TargetModel.php';
require_once __DIR__ . '/../models/LaporanModel.php';

class HalamanController {
    private function otentikasi() {
        $user = JwtHelper::getAuthorizedUser();
        if (!$user) Response::json(401, "error", "Tidak ada otorisasi! Token tidak valid.");
        return $user;
    }

    // --- API DANA DARURAT ---
    public function getDanaDarurat() {
        $user = $this->otentikasi();
        $model = new DanaDaruratModel();
        Response::json(200, "success", $model->get($user['id']));
    }
    public function setTargetDana() {
        $user = $this->otentikasi();
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->jumlah_target)) Response::json(400, "error", "jumlah_target wajib diisi!");
        (new DanaDaruratModel())->setTarget($user['id'], $data->jumlah_target);
        Response::json(200, "success", "Target Dana Darurat diperbarui!");
    }
    public function tambahSaldoDana() {
        $user = $this->otentikasi();
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->dompet_id) || !isset($data->jumlah)) Response::json(400, "error", "dompet_id dan jumlah wajib diisi!");
        
        $res = (new DanaDaruratModel())->addDana($user['id'], $data->dompet_id, $data->jumlah);
        if ($res === true) Response::json(200, "success", "Saldo dana darurat berhasil ditambah!");
        else Response::json(400, "error", $res);
    }

    // --- API TARGET (GOALS) ---
    public function getTarget() {
        $user = $this->otentikasi();
        Response::json(200, "success", (new TargetModel())->getAll($user['id']));
    }
    public function tambahTarget() {
        $user = $this->otentikasi();
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->nama_target) || !isset($data->jumlah_target)) Response::json(400, "error", "Data tidak lengkap!");
        (new TargetModel())->create($user['id'], $data->nama_target, $data->jumlah_target, $data->tanggal_tercapai ?? null);
        Response::json(201, "success", "Target berhasil dibuat!");
    }
    public function tambahSaldoTarget() {
        $user = $this->otentikasi();
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->target_id) || !isset($data->dompet_id) || !isset($data->jumlah)) Response::json(400, "error", "Data tidak lengkap!");
        
        $res = (new TargetModel())->addDana($user['id'], $data->target_id, $data->dompet_id, $data->jumlah);
        if ($res === true) Response::json(200, "success", "Saldo target berhasil ditambah!");
        else Response::json(400, "error", $res);
    }

    // --- API LAPORAN ---
    public function getLaporan() {
        $user = $this->otentikasi();
        $bulan = $_GET['bulan'] ?? date('m');
        $tahun = $_GET['tahun'] ?? date('Y');
        Response::json(200, "success", (new LaporanModel())->getReport($user['id'], $bulan, $tahun));
    }

    public function hapusTarget() {
        $user = $this->otentikasi();
        $id = isset($_GET['id']) ? $_GET['id'] : null;

        if ($id) {
            if ((new TargetModel())->delete($id, $user['id'])) {
                Response::json(200, "success", "Target berhasil dihapus!");
            } else {
                Response::json(500, "error", "Gagal menghapus target.");
            }
        } else {
            Response::json(400, "error", "ID target wajib!");
        }
    }
}