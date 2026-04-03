<?php

class ReportModel {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Mengambil data transaksi dengan filter dinamis
     */
    public function getFilteredTransactions($user_id, $filters = []) {
        $sql = "SELECT t.*, c.category_name, a.account_name 
                FROM transactions t 
                LEFT JOIN categories c ON t.category_id = c.id 
                LEFT JOIN accounts a ON t.account_id = a.id 
                WHERE t.user_id = :user_id";
        
        $params = [':user_id' => $user_id];

        // Filter berdasarkan Tipe (Pemasukan/Pengeluaran/Tabungan)
        if (!empty($filters['type'])) {
            $sql .= " AND t.transaction_type = :type";
            $params[':type'] = $filters['type'];
        }

        // Filter berdasarkan Kategori
        if (!empty($filters['category_id'])) {
            $sql .= " AND t.category_id = :category_id";
            $params[':category_id'] = $filters['category_id'];
        }

        // Filter berdasarkan Rentang Tanggal
        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $sql .= " AND t.transaction_date BETWEEN :start_date AND :end_date";
            $params[':start_date'] = $filters['start_date'] . " 00:00:00";
            $params[':end_date'] = $filters['end_date'] . " 23:59:59";
        }

        $sql .= " ORDER BY t.transaction_date DESC";
        
        // Tambahkan limit jika dipanggil oleh AI agar tidak terlalu berat
        if (isset($filters['limit'])) {
            $sql .= " LIMIT " . (int)$filters['limit'];
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}