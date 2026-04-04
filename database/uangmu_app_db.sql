-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 04, 2026 at 01:08 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `uangmu_app_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `account_name` varchar(100) NOT NULL,
  `account_type` enum('Tabungan','Investasi','E-wallet','Kas','Lainnya') NOT NULL,
  `initial_balance` decimal(15,2) DEFAULT 0.00,
  `current_balance` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `category_icon` varchar(50) DEFAULT 'receipt_long',
  `category_type` enum('Pemasukan','Pengeluaran') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dana_darurat`
--

CREATE TABLE `dana_darurat` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `jumlah_target` decimal(15,2) DEFAULT 0.00,
  `jumlah_terkumpul` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dana_darurat`
--

INSERT INTO `dana_darurat` (`id`, `user_id`, `jumlah_target`, `jumlah_terkumpul`, `created_at`) VALUES
(1, 2, 50000000.00, 0.00, '2026-04-04 06:18:53');

-- --------------------------------------------------------

--
-- Table structure for table `dompet`
--

CREATE TABLE `dompet` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nama_dompet` varchar(255) NOT NULL,
  `saldo` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dompet`
--

INSERT INTO `dompet` (`id`, `user_id`, `nama_dompet`, `saldo`, `created_at`) VALUES
(1, 2, 'Rekening BCA', 3200000.00, '2026-04-04 05:46:12'),
(2, 2, 'Rekening Mandiri', 5000000.00, '2026-04-04 10:55:23');

-- --------------------------------------------------------

--
-- Table structure for table `emergency_fund`
--

CREATE TABLE `emergency_fund` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `target_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `current_amount` decimal(15,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id` int(11) NOT NULL,
  `nama_kategori` varchar(255) NOT NULL,
  `tipe` enum('Pemasukan','Pengeluaran') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`id`, `nama_kategori`, `tipe`) VALUES
(1, 'Gaji', 'Pemasukan'),
(2, 'Bonus', 'Pemasukan'),
(3, 'Makanan', 'Pengeluaran'),
(4, 'Transportasi', 'Pengeluaran'),
(5, 'Tagihan', 'Pengeluaran'),
(6, 'Hiburan', 'Pengeluaran');

-- --------------------------------------------------------

--
-- Table structure for table `target_finansial`
--

CREATE TABLE `target_finansial` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nama_target` varchar(100) NOT NULL,
  `jumlah_target` decimal(15,2) NOT NULL,
  `terkumpul` decimal(15,2) DEFAULT 0.00,
  `tanggal_tercapai` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `target_finansial`
--

INSERT INTO `target_finansial` (`id`, `user_id`, `nama_target`, `jumlah_target`, `terkumpul`, `tanggal_tercapai`, `created_at`) VALUES
(1, 2, 'Beli Laptop Baru', 10000000.00, 3000000.00, '2024-12-31', '2026-04-04 02:27:57'),
(2, 2, 'Beli Motor Baru', 20000000.00, 0.00, '2024-12-31', '2026-04-04 06:21:25'),
(3, 2, 'Beli iPhone', 15000000.00, 0.00, NULL, '2026-04-04 10:56:15');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `target_id` int(11) DEFAULT NULL,
  `transaction_type` enum('Awal','Pemasukan','Pengeluaran','Tabungan','Koreksi Saldo') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text DEFAULT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `dompet_id` int(11) DEFAULT NULL,
  `kategori_id` int(11) DEFAULT NULL,
  `nama_transaksi` varchar(255) NOT NULL,
  `jenis` enum('Pemasukan','Pengeluaran','Tabungan') NOT NULL,
  `tipe` enum('AWAL','BARU','RUTIN') NOT NULL,
  `frekuensi` enum('Harian','Mingguan','Bulanan','Tahunan') DEFAULT NULL,
  `is_berulang` tinyint(1) DEFAULT 0,
  `jumlah` decimal(15,2) NOT NULL,
  `tanggal` date NOT NULL,
  `keterangan` text DEFAULT NULL,
  `target_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaksi`
--

INSERT INTO `transaksi` (`id`, `user_id`, `dompet_id`, `kategori_id`, `nama_transaksi`, `jenis`, `tipe`, `frekuensi`, `is_berulang`, `jumlah`, `tanggal`, `keterangan`, `target_id`, `created_at`) VALUES
(1, 2, NULL, NULL, 'Sisa Gaji Bulan Lalu', 'Pemasukan', 'AWAL', NULL, 0, 1500000.00, '2023-11-01', 'Saldo awal', NULL, '2026-04-04 02:11:58'),
(2, 2, NULL, NULL, 'Gaji Proyek Lepas', 'Pemasukan', 'BARU', NULL, 0, 500000.00, '2023-11-05', 'Bonus desain UI/UX', NULL, '2026-04-04 02:17:48'),
(3, 2, NULL, NULL, 'Makan Siang', 'Pengeluaran', 'BARU', NULL, 0, 35000.00, '2023-11-06', 'Makan di Warteg', NULL, '2026-04-04 02:18:11'),
(4, 2, NULL, NULL, 'Alokasi Tabungan', 'Tabungan', 'BARU', NULL, 0, 500000.00, '2023-11-10', 'Nabung bulan pertama', 1, '2026-04-04 02:30:11'),
(5, 2, 1, 5, 'Bayar Kos', 'Pengeluaran', 'RUTIN', NULL, 0, 800000.00, '2024-01-01', 'Kos bulanan', NULL, '2026-04-04 05:54:05'),
(6, 2, 1, NULL, 'Nabung Goals', 'Tabungan', 'BARU', NULL, 0, 1000000.00, '2026-04-04', NULL, 1, '2026-04-04 06:19:37'),
(7, 2, 1, 1, 'Gaji Bulan Ini', 'Pemasukan', 'BARU', NULL, 0, 3000000.00, '2023-11-01', NULL, NULL, '2026-04-04 10:55:47'),
(8, 2, 1, 3, 'Bayar Kos', 'Pengeluaran', 'RUTIN', 'Bulanan', 1, 1000000.00, '2023-11-05', NULL, NULL, '2026-04-04 10:56:01'),
(9, 2, 1, NULL, 'Nabung Target', 'Tabungan', 'BARU', NULL, 0, 2000000.00, '2026-04-04', NULL, 1, '2026-04-04 10:56:33');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `first_name`, `last_name`, `password`, `created_at`) VALUES
(1, 'admin', NULL, NULL, '$2y$10$VvvHJSc/dM3AsqK2ztjCN.QM9iBYA5T7rrlLHsNn/h5H05eIIXL/O', '2026-04-02 03:10:38'),
(2, 'Budi', NULL, NULL, '$2y$10$SYGh2rWSjggbsTsj2TOJEOP13AH4dbzw15VLiqDT/SdYwUgBg.gSy', '2026-04-04 01:55:47'),
(3, 'Joko', NULL, NULL, '$2y$10$521IRQ/htE4ZGC1OPe9Xr.it6s4r2/wiEJcPZB2gnQljXM3qqXOhu', '2026-04-04 10:54:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `dana_darurat`
--
ALTER TABLE `dana_darurat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `dompet`
--
ALTER TABLE `dompet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `emergency_fund`
--
ALTER TABLE `emergency_fund`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `target_finansial`
--
ALTER TABLE `target_finansial`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `target_id` (`target_id`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `target_id` (`target_id`),
  ADD KEY `dompet_id` (`dompet_id`),
  ADD KEY `kategori_id` (`kategori_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dana_darurat`
--
ALTER TABLE `dana_darurat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `dompet`
--
ALTER TABLE `dompet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `emergency_fund`
--
ALTER TABLE `emergency_fund`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `target_finansial`
--
ALTER TABLE `target_finansial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `dana_darurat`
--
ALTER TABLE `dana_darurat`
  ADD CONSTRAINT `dana_darurat_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `dompet`
--
ALTER TABLE `dompet`
  ADD CONSTRAINT `dompet_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `emergency_fund`
--
ALTER TABLE `emergency_fund`
  ADD CONSTRAINT `emergency_fund_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `target_finansial`
--
ALTER TABLE `target_finansial`
  ADD CONSTRAINT `target_finansial_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `transactions_ibfk_4` FOREIGN KEY (`target_id`) REFERENCES `target_finansial` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transaksi_ibfk_2` FOREIGN KEY (`target_id`) REFERENCES `target_finansial` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `transaksi_ibfk_3` FOREIGN KEY (`dompet_id`) REFERENCES `dompet` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transaksi_ibfk_4` FOREIGN KEY (`kategori_id`) REFERENCES `kategori` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
