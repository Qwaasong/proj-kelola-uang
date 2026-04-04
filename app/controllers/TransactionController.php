<?php
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../models/TransactionModel.php';

class TransactionController {
    private $transactionModel;

    public function __construct() {
        $this->transactionModel = new TransactionModel();
    }

    public function addAwal() {
        $raw_data = file_get_contents("php://input");
        $data = json_decode($raw_data);
        if (!$data) Response::json(400, "error", ["message" => "Format JSON tidak valid!", "alasan" => json_last_error_msg()]);

        if(isset($data->user_id) && isset($data->nama_transaksi) && isset($data->jenis) && isset($data->jumlah) && isset($data->tanggal)) {
            $keterangan = isset($data->keterangan) ? $data->keterangan : null;
            if($this->transactionModel->createAwal($data->user_id, $data->nama_transaksi, $data->jenis, $data->jumlah, $data->tanggal, $keterangan)) {
                Response::json(201, "success", "Data Transaksi Awal berhasil dicatat!");
            } else {
                Response::json(500, "error", "Gagal mencatat transaksi awal pada database.");
            }
        } else {
            Response::json(400, "error", "Data tidak lengkap!");
        }
    }

    public function addBaru() {
        $raw_data = file_get_contents("php://input");
        $data = json_decode($raw_data);
        if (!$data) Response::json(400, "error", ["message" => "Format JSON tidak valid!", "alasan" => json_last_error_msg()]);

        if(isset($data->user_id) && isset($data->nama_transaksi) && isset($data->jenis) && isset($data->jumlah) && isset($data->tanggal)) {
            if($data->jenis !== 'Pemasukan' && $data->jenis !== 'Pengeluaran') {
                Response::json(400, "error", "Jenis transaksi harus 'Pemasukan' atau 'Pengeluaran'!");
            }
            $keterangan = isset($data->keterangan) ? $data->keterangan : null;
            if($this->transactionModel->createBaru($data->user_id, $data->nama_transaksi, $data->jenis, $data->jumlah, $data->tanggal, $keterangan)) {
                Response::json(201, "success", "Data {$data->jenis} Baru berhasil dicatat!");
            } else {
                Response::json(500, "error", "Gagal mencatat transaksi pada database.");
            }
        } else {
            Response::json(400, "error", "Data tidak lengkap!");
        }
    }

    // --- BARU: Fungsi khusus untuk Endpoint Tabungan ---
    public function addTabungan() {
        $raw_data = file_get_contents("php://input");
        $data = json_decode($raw_data);
        if (!$data) Response::json(400, "error", ["message" => "Format JSON tidak valid!", "alasan" => json_last_error_msg()]);

        if(isset($data->user_id) && isset($data->jumlah) && isset($data->tanggal)) {
            $keterangan = isset($data->keterangan) ? $data->keterangan : null;
            $target_id = isset($data->target_id) ? $data->target_id : null; // Opsional

            if($this->transactionModel->createTabungan($data->user_id, $data->jumlah, $data->tanggal, $keterangan, $target_id)) {
                Response::json(201, "success", "Data Tabungan berhasil dicatat!");
            } else {
                Response::json(500, "error", "Gagal mencatat tabungan pada database.");
            }
        } else {
            Response::json(400, "error", "Data tidak lengkap! Butuh: user_id, jumlah, tanggal.");
        }
    }
}