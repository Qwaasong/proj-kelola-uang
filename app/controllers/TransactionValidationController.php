<?php

class TransactionValidationController {
    public static function validate($data) {
        if (empty($data['amount']) || $data['amount'] <= 0) {
            return "Jumlah transaksi harus lebih dari 0.";
        }
        if (empty($data['transaction_type'])) {
            return "Tipe transaksi wajib dipilih.";
        }
        if (empty($data['account_id'])) {
            return "Dompet/Akun wajib dipilih.";
        }
        return null; // Tidak ada error
    }
}