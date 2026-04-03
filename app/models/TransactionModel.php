<?php

class TransactionModel {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function createTransaction($data) {
        $sql = "INSERT INTO transactions (user_id, account_id, category_id, target_id, transaction_type, amount, description, transaction_date) 
                VALUES (:user_id, :account_id, :category_id, :target_id, :transaction_type, :amount, :description, :transaction_date)";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->bindParam(':user_id', $data['user_id']);
        $stmt->bindParam(':account_id', $data['account_id']);
        $stmt->bindParam(':category_id', $data['category_id']);
        $stmt->bindParam(':target_id', $data['target_id']);
        $stmt->bindParam(':transaction_type', $data['transaction_type']);
        $stmt->bindParam(':amount', $data['amount']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':transaction_date', $data['transaction_date']);
        
        return $stmt->execute();
    }
}