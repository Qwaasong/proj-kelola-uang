<?php
require_once __DIR__ . '/../config/database.php';

class TransaksiModel {
    private $conn;

    public function __construct() {
        $this->conn = Database::getConnection();
    }

    public function getPaginated($user_id, $search, $limit, $offset) {
        $query = "SELECT t.*, d.nama_dompet, k.nama_kategori 
                  FROM transaksi t
                  LEFT JOIN dompet d ON t.dompet_id = d.id
                  LEFT JOIN kategori k ON t.kategori_id = k.id
                  WHERE t.user_id = :user_id";

        if (!empty($search)) {
            $query .= " AND t.nama_transaksi LIKE :search";
        }
        $query .= " ORDER BY t.tanggal DESC, t.created_at DESC LIMIT :limit OFFSET :offset";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        if (!empty($search)) $stmt->bindValue(':search', '%' . $search . '%', PDO::PARAM_STR);
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function countTotal($user_id, $search) {
        $query = "SELECT COUNT(id) as total FROM transaksi WHERE user_id = :user_id";
        if (!empty($search)) $query .= " AND nama_transaksi LIKE :search";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        if (!empty($search)) $stmt->bindValue(':search', '%' . $search . '%', PDO::PARAM_STR);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }

    // UPDATE: Menambahkan is_berulang dan frekuensi langsung ke tabel ini
    public function createTransaksi($user_id, $dompet_id, $kategori_id, $nama_transaksi, $jenis, $tipe, $jumlah, $tanggal, $keterangan, $is_berulang, $frekuensi) {
        try {
            $this->conn->beginTransaction();

            $query = "INSERT INTO transaksi (user_id, dompet_id, kategori_id, nama_transaksi, jenis, tipe, jumlah, tanggal, keterangan, is_berulang, frekuensi) 
                      VALUES (:user_id, :dompet_id, :kategori_id, :nama_transaksi, :jenis, :tipe, :jumlah, :tanggal, :keterangan, :is_berulang, :frekuensi)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ':user_id' => $user_id, ':dompet_id' => $dompet_id, ':kategori_id' => $kategori_id, 
                ':nama_transaksi' => $nama_transaksi, ':jenis' => $jenis, ':tipe' => $tipe, 
                ':jumlah' => $jumlah, ':tanggal' => $tanggal, ':keterangan' => $keterangan,
                ':is_berulang' => $is_berulang ? 1 : 0, ':frekuensi' => $frekuensi
            ]);

            if ($dompet_id) {
                $qDompet = ($jenis === 'Pemasukan') ? 
                    "UPDATE dompet SET saldo = saldo + :jumlah WHERE id = :dompet_id AND user_id = :user_id" : 
                    "UPDATE dompet SET saldo = saldo - :jumlah WHERE id = :dompet_id AND user_id = :user_id";
                $stmtDompet = $this->conn->prepare($qDompet);
                $stmtDompet->execute([':jumlah' => $jumlah, ':dompet_id' => $dompet_id, ':user_id' => $user_id]);
            }

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    public function updateTransaksi($id, $user_id, $dompet_id, $kategori_id, $nama_transaksi, $jenis, $jumlah, $tanggal, $keterangan, $is_berulang, $frekuensi) {
        try {
            $this->conn->beginTransaction();

            $qOld = "SELECT dompet_id, jenis, jumlah FROM transaksi WHERE id = :id AND user_id = :user_id FOR UPDATE";
            $stmtOld = $this->conn->prepare($qOld);
            $stmtOld->execute([':id' => $id, ':user_id' => $user_id]);
            $oldTx = $stmtOld->fetch(PDO::FETCH_ASSOC);

            if (!$oldTx) { $this->conn->rollBack(); return false; }

            if ($oldTx['dompet_id']) {
                $revQuery = ($oldTx['jenis'] === 'Pemasukan') ? 
                    "UPDATE dompet SET saldo = saldo - :jumlah WHERE id = :dompet_id AND user_id = :user_id" : 
                    "UPDATE dompet SET saldo = saldo + :jumlah WHERE id = :dompet_id AND user_id = :user_id";
                $stmtRev = $this->conn->prepare($revQuery);
                $stmtRev->execute([':jumlah' => $oldTx['jumlah'], ':dompet_id' => $oldTx['dompet_id'], ':user_id' => $user_id]);
            }

            if ($dompet_id) {
                $appQuery = ($jenis === 'Pemasukan') ? 
                    "UPDATE dompet SET saldo = saldo + :jumlah WHERE id = :dompet_id AND user_id = :user_id" : 
                    "UPDATE dompet SET saldo = saldo - :jumlah WHERE id = :dompet_id AND user_id = :user_id";
                $stmtApp = $this->conn->prepare($appQuery);
                $stmtApp->execute([':jumlah' => $jumlah, ':dompet_id' => $dompet_id, ':user_id' => $user_id]);
            }

            $qUpdate = "UPDATE transaksi SET dompet_id = :dompet_id, kategori_id = :kategori_id, nama_transaksi = :nama_transaksi, 
                        jenis = :jenis, jumlah = :jumlah, tanggal = :tanggal, keterangan = :keterangan, is_berulang = :is_berulang, frekuensi = :frekuensi 
                        WHERE id = :id AND user_id = :user_id";
            $stmtUpd = $this->conn->prepare($qUpdate);
            $stmtUpd->execute([
                ':dompet_id' => $dompet_id, ':kategori_id' => $kategori_id, ':nama_transaksi' => $nama_transaksi,
                ':jenis' => $jenis, ':jumlah' => $jumlah, ':tanggal' => $tanggal, ':keterangan' => $keterangan,
                ':is_berulang' => $is_berulang ? 1 : 0, ':frekuensi' => $frekuensi, ':id' => $id, ':user_id' => $user_id
            ]);

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    public function deleteTransaksi($id, $user_id) {
        try {
            $this->conn->beginTransaction();

            // 1. Ambil data transaksi lama untuk tahu apa yang harus dibalikkan
            $qOld = "SELECT dompet_id, jenis, jumlah FROM transaksi WHERE id = :id AND user_id = :user_id FOR UPDATE";
            $stmtOld = $this->conn->prepare($qOld);
            $stmtOld->execute([':id' => $id, ':user_id' => $user_id]);
            $oldTx = $stmtOld->fetch(PDO::FETCH_ASSOC);

            if (!$oldTx) { $this->conn->rollBack(); return false; }

            // 2. Balikkan saldo dompet
            if ($oldTx['dompet_id']) {
                $revQuery = ($oldTx['jenis'] === 'Pemasukan') ? 
                    "UPDATE dompet SET saldo = saldo - :jumlah WHERE id = :dompet_id AND user_id = :user_id" : 
                    "UPDATE dompet SET saldo = saldo + :jumlah WHERE id = :dompet_id AND user_id = :user_id";
                $stmtRev = $this->conn->prepare($revQuery);
                $stmtRev->execute([':jumlah' => $oldTx['jumlah'], ':dompet_id' => $oldTx['dompet_id'], ':user_id' => $user_id]);
            }

            // 3. Hapus Transaksi
            $qDel = "DELETE FROM transaksi WHERE id = :id AND user_id = :user_id";
            $stmtDel = $this->conn->prepare($qDel);
            $stmtDel->execute([':id' => $id, ':user_id' => $user_id]);

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }
}