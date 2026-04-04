<?php
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../models/ReportModel.php';

class ReportController {
    private $reportModel;

    public function __construct() {
        $this->reportModel = new ReportModel();
    }

    public function history() {
        $raw_data = file_get_contents("php://input");
        $data = json_decode($raw_data, true); // Ubah JSON ke bentuk Array

        if (!isset($data['user_id'])) {
            Response::json(400, "error", "user_id diperlukan untuk melihat riwayat!");
        }

        // Tangkap filter jika dikirimkan oleh user, jika tidak biarkan null
        $filters = [
            'jenis' => isset($data['jenis']) ? $data['jenis'] : null,
            'tanggal_mulai' => isset($data['tanggal_mulai']) ? $data['tanggal_mulai'] : null,
            'tanggal_selesai' => isset($data['tanggal_selesai']) ? $data['tanggal_selesai'] : null
        ];

        $history = $this->reportModel->getHistory($data['user_id'], $filters);
        
        Response::json(200, "success", [
            "message" => "Riwayat transaksi berhasil diambil",
            "total_data" => count($history),
            "data" => $history
        ]);
    }

    public function summary() {
        $raw_data = file_get_contents("php://input");
        $data = json_decode($raw_data);

        if (!isset($data->user_id)) {
            Response::json(400, "error", "user_id diperlukan untuk melihat ringkasan!");
        }

        $summary = $this->reportModel->getSummary($data->user_id);
        
        Response::json(200, "success", [
            "message" => "Ringkasan saldo berhasil diambil",
            "data" => $summary
        ]);
    }
}   