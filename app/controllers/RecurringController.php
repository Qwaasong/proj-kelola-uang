<?php
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../models/RecurringModel.php';

class RecurringController {
    private $recurringModel;

    public function __construct() {
        $this->recurringModel = new RecurringModel();
    }

    public function addPemasukan() {
        $raw_data = file_get_contents("php://input");
        $data = json_decode($raw_data);

        if (!$data) Response::json(400, "error", "Format JSON tidak valid!");

        if(isset($data->user_id) && isset($data->nama_pemasukan) && isset($data->jumlah) && isset($data->frekuensi) && isset($data->tanggal_mulai)) {
            if($this->recurringModel->createPemasukanBerulang($data->user_id, $data->nama_pemasukan, $data->jumlah, $data->frekuensi, $data->tanggal_mulai)) {
                Response::json(201, "success", "Pemasukan Berulang berhasil dicatat!");
            } else {
                Response::json(500, "error", "Gagal mencatat Pemasukan Berulang.");
            }
        } else {
            Response::json(400, "error", "Data tidak lengkap! Butuh: user_id, nama_pemasukan, jumlah, frekuensi, tanggal_mulai.");
        }
    }

    public function addPengeluaran() {
        $raw_data = file_get_contents("php://input");
        $data = json_decode($raw_data);

        if (!$data) Response::json(400, "error", "Format JSON tidak valid!");

        if(isset($data->user_id) && isset($data->nama_pengeluaran) && isset($data->jumlah) && isset($data->frekuensi) && isset($data->tanggal_mulai)) {
            if($this->recurringModel->createPengeluaranBerulang($data->user_id, $data->nama_pengeluaran, $data->jumlah, $data->frekuensi, $data->tanggal_mulai)) {
                Response::json(201, "success", "Pengeluaran Berulang berhasil dicatat!");
            } else {
                Response::json(500, "error", "Gagal mencatat Pengeluaran Berulang.");
            }
        } else {
            Response::json(400, "error", "Data tidak lengkap! Butuh: user_id, nama_pengeluaran, jumlah, frekuensi, tanggal_mulai.");
        }
    }
}