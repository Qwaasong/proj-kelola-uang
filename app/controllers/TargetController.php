<?php
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../models/TargetModel.php';

class TargetController {
    private $targetModel;

    public function __construct() {
        $this->targetModel = new TargetModel();
    }

    public function addTarget() {
        $raw_data = file_get_contents("php://input");
        $data = json_decode($raw_data);

        if (!$data) Response::json(400, "error", "Format JSON tidak valid!");

        if(isset($data->user_id) && isset($data->nama_target) && isset($data->jumlah_target)) {
            // Tanggal tercapai bersifat opsional
            $tanggal_tercapai = isset($data->tanggal_tercapai) ? $data->tanggal_tercapai : null;

            if($this->targetModel->createTarget($data->user_id, $data->nama_target, $data->jumlah_target, $tanggal_tercapai)) {
                Response::json(201, "success", "Target Finansial berhasil dicatat!");
            } else {
                Response::json(500, "error", "Gagal mencatat Target Finansial.");
            }
        } else {
            Response::json(400, "error", "Data tidak lengkap! Butuh: user_id, nama_target, jumlah_target.");
        }
    }
}