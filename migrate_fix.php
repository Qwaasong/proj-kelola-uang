<?php
require_once __DIR__ . '/app/config/database.php';

try {
    $db = Database::getConnection();
    echo "Checking tables...\n";

    // 1. Create 'dompet' table if not exists
    $db->exec("CREATE TABLE IF NOT EXISTS `dompet` (
      `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      `user_id` int(11) NOT NULL,
      `nama_dompet` varchar(255) NOT NULL,
      `saldo` decimal(15,2) DEFAULT 0.00,
      `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
      CONSTRAINT `dompet_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;");
    echo "- Table 'dompet' is ready.\n";

    // 2. Fix 'target_finansial' table if 'terkumpul' is missing
    $checkTarget = $db->query("SHOW COLUMNS FROM `target_finansial` LIKE 'terkumpul'")->fetch();
    if (!$checkTarget) {
        $db->exec("ALTER TABLE `target_finansial` ADD COLUMN `terkumpul` decimal(15,2) DEFAULT 0.00 AFTER `jumlah_target` ");
        echo "- Column 'terkumpul' added to 'target_finansial'.\n";
    }

    // 3. Ensure 'kategori' table exists
    $db->exec("CREATE TABLE IF NOT EXISTS `kategori` (
      `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      `nama_kategori` varchar(255) NOT NULL,
      `tipe` enum('Pemasukan','Pengeluaran') NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    
    // Seed categories if empty
    $countKat = $db->query("SELECT COUNT(*) FROM kategori")->fetchColumn();
    if ($countKat == 0) {
        $db->exec("INSERT INTO kategori (nama_kategori, tipe) VALUES 
            ('Gaji', 'Pemasukan'), ('Makanan', 'Pengeluaran'), ('Transportasi', 'Pengeluaran')");
        echo "- Table 'kategori' seeded.\n";
    }

    // 4. Ensure 'dana_darurat' table exists
    $db->exec("CREATE TABLE IF NOT EXISTS `dana_darurat` (
      `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      `user_id` int(11) NOT NULL,
      `jumlah_target` decimal(15,2) DEFAULT 0.00,
      `jumlah_terkumpul` decimal(15,2) DEFAULT 0.00,
      `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
      FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 5. Inspect and Fix 'transaksi' table columns
    $cols = $db->query("SHOW COLUMNS FROM `transaksi`")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('dompet_id', $cols)) {
        $db->exec("ALTER TABLE `transaksi` ADD COLUMN `dompet_id` int(11) DEFAULT NULL AFTER `user_id` ");
        echo "- Column 'dompet_id' added to 'transaksi'.\n";
    }
    if (!in_array('target_id', $cols)) {
        $db->exec("ALTER TABLE `transaksi` ADD COLUMN `target_id` int(11) DEFAULT NULL AFTER `jumlah` ");
        echo "- Column 'target_id' added to 'transaksi'.\n";
    }
    if (!in_array('kategori_id', $cols)) {
        $db->exec("ALTER TABLE `transaksi` ADD COLUMN `kategori_id` int(11) DEFAULT NULL AFTER `dompet_id` ");
        echo "- Column 'kategori_id' added to 'transaksi'.\n";
    }
    if (!in_array('is_berulang', $cols)) {
        $db->exec("ALTER TABLE `transaksi` ADD COLUMN `is_berulang` tinyint(1) DEFAULT 0 AFTER `tipe` ");
        echo "- Column 'is_berulang' added to 'transaksi'.\n";
    }
    if (!in_array('frekuensi', $cols)) {
        $db->exec("ALTER TABLE `transaksi` ADD COLUMN `frekuensi` enum('Harian','Mingguan','Bulanan','Tahunan') DEFAULT NULL AFTER `is_berulang` ");
        echo "- Column 'frekuensi' added to 'transaksi'.\n";
    }

    echo "\nDatabase sync completed successfully!\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
