<?php
require_once __DIR__ . '/../config/database.php';

class TransaksiModel {
    private $conn;

    public function __construct() {
        $this->conn = Database::getConnection();
    }

    public function getPaginated($user_id, $search, $limit, $offset, $filters = []) {
        $query = "SELECT t.*, d.nama_dompet, k.nama_kategori 
                  FROM transaksi t
                  LEFT JOIN dompet d ON t.dompet_id = d.id
                  LEFT JOIN kategori k ON t.kategori_id = k.id
                  WHERE t.user_id = :user_id";

        $params = [':user_id' => $user_id];

        if (!empty($search)) {
            $query .= " AND t.keterangan LIKE :search";
            $params[':search'] = '%' . $search . '%';
        }

        if (!empty($filters['kategori_id'])) {
            $query .= " AND t.kategori_id = :kategori_id";
            $params[':kategori_id'] = $filters['kategori_id'];
        }

        if (!empty($filters['dompet_id'])) {
            $query .= " AND t.dompet_id = :dompet_id";
            $params[':dompet_id'] = $filters['dompet_id'];
        }

        if (!empty($filters['jenis'])) {
            $query .= " AND t.jenis = :jenis";
            $params[':jenis'] = $filters['jenis'];
        }

        // Sorting Logic with Allow-list
        $allowedSortColumns = ['tanggal', 'jumlah', 'created_at', 'keterangan'];
        $sortBy = isset($filters['sort_by']) && in_array($filters['sort_by'], $allowedSortColumns) ? $filters['sort_by'] : 'tanggal';
        $order = isset($filters['order']) && strtoupper($filters['order']) === 'ASC' ? 'ASC' : 'DESC';

        $query .= " ORDER BY t.$sortBy $order, t.created_at DESC LIMIT :limit OFFSET :offset";

        $stmt = $this->conn->prepare($query);
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function countTotal($user_id, $search, $filters = []) {
        $query = "SELECT COUNT(id) as total FROM transaksi WHERE user_id = :user_id";
        $params = [':user_id' => $user_id];

        if (!empty($search)) {
            $query .= " AND keterangan LIKE :search";
            $params[':search'] = '%' . $search . '%';
        }

        if (!empty($filters['kategori_id'])) {
            $query .= " AND kategori_id = :kategori_id";
            $params[':kategori_id'] = $filters['kategori_id'];
        }

        if (!empty($filters['dompet_id'])) {
            $query .= " AND dompet_id = :dompet_id";
            $params[':dompet_id'] = $filters['dompet_id'];
        }

        if (!empty($filters['jenis'])) {
            $query .= " AND jenis = :jenis";
            $params[':jenis'] = $filters['jenis'];
        }

        $stmt = $this->conn->prepare($query);
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }

    public function createTransaksi($user_id, $dompet_id, $kategori_id, $jenis, $tipe, $jumlah, $tanggal, $keterangan, $is_berulang, $selected_days, $limit_date) {
        try {
            $this->conn->beginTransaction();

            $query = "INSERT INTO transaksi (user_id, dompet_id, kategori_id, jenis, tipe, jumlah, tanggal, keterangan, is_berulang, selected_days, limit_date) 
                      VALUES (:user_id, :dompet_id, :kategori_id, :jenis, :tipe, :jumlah, :tanggal, :keterangan, :is_berulang, :selected_days, :limit_date)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ':user_id' => $user_id, ':dompet_id' => $dompet_id, ':kategori_id' => $kategori_id, 
                ':jenis' => $jenis, ':tipe' => $tipe, 
                ':jumlah' => $jumlah, ':tanggal' => $tanggal, ':keterangan' => $keterangan,
                ':is_berulang' => $is_berulang ? 1 : 0, ':selected_days' => $selected_days, ':limit_date' => $limit_date
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

    public function updateTransaksi($id, $user_id, $dompet_id, $kategori_id, $jenis, $jumlah, $tanggal, $keterangan, $is_berulang, $selected_days, $limit_date) {
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

            $qUpdate = "UPDATE transaksi SET dompet_id = :dompet_id, kategori_id = :kategori_id, 
                        jenis = :jenis, jumlah = :jumlah, tanggal = :tanggal, keterangan = :keterangan, 
                        is_berulang = :is_berulang, selected_days = :selected_days, limit_date = :limit_date 
                        WHERE id = :id AND user_id = :user_id";
            $stmtUpd = $this->conn->prepare($qUpdate);
            $stmtUpd->execute([
                ':dompet_id' => $dompet_id, ':kategori_id' => $kategori_id,
                ':jenis' => $jenis, ':jumlah' => $jumlah, ':tanggal' => $tanggal, ':keterangan' => $keterangan,
                ':is_berulang' => $is_berulang ? 1 : 0, ':selected_days' => $selected_days, ':limit_date' => $limit_date, 
                ':id' => $id, ':user_id' => $user_id
            ]);

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    // UPDATE: Method dihapus tunggal ditingkatkan menjadi delete massal (multiple)
    public function deleteMultipleTransaksi($ids, $user_id) {
        if (empty($ids)) return false;

        try {
            $this->conn->beginTransaction();

            // Membuat placeholder '?' dinamis sesuai jumlah ID yang diberikan (contoh: "?, ?, ?")
            $inQuery = implode(',', array_fill(0, count($ids), '?'));
            $params = $ids;
            $params[] = $user_id;

            // 1. Ambil data transaksi lama untuk mengembalikan (revert) saldo dompet
            $qOld = "SELECT dompet_id, jenis, jumlah FROM transaksi WHERE id IN ($inQuery) AND user_id = ? FOR UPDATE";
            $stmtOld = $this->conn->prepare($qOld);
            $stmtOld->execute($params);
            $oldTxs = $stmtOld->fetchAll(PDO::FETCH_ASSOC);

            if (!$oldTxs) { 
                $this->conn->rollBack(); 
                return false; 
            }

            // 2. Balikkan (revert) saldo dompet untuk tiap transaksi yang terhapus
            foreach ($oldTxs as $oldTx) {
                if ($oldTx['dompet_id']) {
                    $revQuery = ($oldTx['jenis'] === 'Pemasukan') ? 
                        "UPDATE dompet SET saldo = saldo - :jumlah WHERE id = :dompet_id AND user_id = :user_id" : 
                        "UPDATE dompet SET saldo = saldo + :jumlah WHERE id = :dompet_id AND user_id = :user_id";
                    $stmtRev = $this->conn->prepare($revQuery);
                    $stmtRev->execute([
                        ':jumlah' => $oldTx['jumlah'], 
                        ':dompet_id' => $oldTx['dompet_id'], 
                        ':user_id' => $user_id
                    ]);
                }
            }

            // 3. Hapus Transaksi Sekaligus
            $qDel = "DELETE FROM transaksi WHERE id IN ($inQuery) AND user_id = ?";
            $stmtDel = $this->conn->prepare($qDel);
            $stmtDel->execute($params);

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }
}
