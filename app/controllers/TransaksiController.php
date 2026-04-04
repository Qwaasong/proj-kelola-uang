<?php
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/JwtHelper.php';
require_once __DIR__ . '/../models/TransaksiModel.php';
require_once __DIR__ . '/../models/KategoriModel.php';

class TransaksiController {
    private $transaksiModel;
    private $kategoriModel;

    public function __construct() {
        $this->transaksiModel = new TransaksiModel();
        $this->kategoriModel = new KategoriModel();
    }

    private function otentikasi() {
        $user = JwtHelper::getAuthorizedUser();
        if (!$user) Response::json(401, "error", "Tidak ada otorisasi! Token tidak valid.");
        return $user;
    }

    public function getKategori() {
        $data = $this->kategoriModel->getAll();
        Response::json(200, "success", $data);
    }

    public function getSemua() {
        $user = $this->otentikasi();
        
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $search = isset($_GET['search']) ? $_GET['search'] : '';
        $offset = ($page - 1) * $limit;

        $data = $this->transaksiModel->getPaginated($user['id'], $search, $limit, $offset);
        $total_data = $this->transaksiModel->countTotal($user['id'], $search);

        Response::json(200, "success", [
            "data" => $data,
            "pagination" => [
                "total_data" => $total_data,
                "total_page" => ceil($total_data / $limit),
                "current_page" => $page,
                "limit" => $limit
            ]
        ]);
    }

    public function tambah() {
        $user = $this->otentikasi();
        $data = json_decode(file_get_contents("php://input"));

        if (isset($data->nama_transaksi, $data->jenis, $data->jumlah, $data->tanggal)) {
            $dompet_id = !empty($data->dompet_id) ? $data->dompet_id : null;
            $kategori_id = !empty($data->kategori_id) ? $data->kategori_id : null;
            $keterangan = !empty($data->keterangan) ? $data->keterangan : null;
            
            $is_berulang = isset($data->is_berulang) ? $data->is_berulang : false;
            $frekuensi = !empty($data->frekuensi) ? $data->frekuensi : null;
            $tipe = $is_berulang ? 'RUTIN' : 'BARU';

            $sukses = $this->transaksiModel->createTransaksi(
                $user['id'], $dompet_id, $kategori_id, $data->nama_transaksi, 
                $data->jenis, $tipe, $data->jumlah, $data->tanggal, $keterangan, $is_berulang, $frekuensi
            );

            if ($sukses) Response::json(201, "success", "Transaksi berhasil ditambahkan!");
            else Response::json(500, "error", "Gagal menyimpan transaksi.");
        } else {
            Response::json(400, "error", "Data tidak lengkap!");
        }
    }

    public function perbarui() {
        $user = $this->otentikasi();
        $data = json_decode(file_get_contents("php://input"));

        if (isset($data->id, $data->nama_transaksi, $data->jenis, $data->jumlah, $data->tanggal)) {
            $dompet_id = !empty($data->dompet_id) ? $data->dompet_id : null;
            $kategori_id = !empty($data->kategori_id) ? $data->kategori_id : null;
            $keterangan = !empty($data->keterangan) ? $data->keterangan : null;
            $is_berulang = isset($data->is_berulang) ? $data->is_berulang : false;
            $frekuensi = !empty($data->frekuensi) ? $data->frekuensi : null;

            $sukses = $this->transaksiModel->updateTransaksi(
                $data->id, $user['id'], $dompet_id, $kategori_id, 
                $data->nama_transaksi, $data->jenis, $data->jumlah, $data->tanggal, $keterangan, $is_berulang, $frekuensi
            );

            if ($sukses) Response::json(200, "success", "Transaksi berhasil diubah!");
            else Response::json(500, "error", "Gagal mengubah transaksi.");
        } else {
            Response::json(400, "error", "Data tidak lengkap untuk pembaruan!");
        }
    }

    public function hapus() {
        $user = $this->otentikasi();
        $id = isset($_GET['id']) ? $_GET['id'] : null;

        if ($id) {
            if ($this->transaksiModel->deleteTransaksi($id, $user['id'])) {
                Response::json(200, "success", "Transaksi berhasil dihapus!");
            } else {
                Response::json(500, "error", "Gagal menghapus transaksi.");
            }
        } else {
            Response::json(400, "error", "ID transaksi wajib!");
        }
    }
}