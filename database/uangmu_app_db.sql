-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 05, 2026 at 03:55 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.26

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
-- Table structure for table `dana_darurat`
--

CREATE TABLE `dana_darurat` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `jumlah_target` decimal(15,2) DEFAULT '0.00',
  `jumlah_terkumpul` decimal(15,2) DEFAULT '0.00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dana_darurat`
--

INSERT INTO `dana_darurat` (`id`, `user_id`, `jumlah_target`, `jumlah_terkumpul`, `created_at`) VALUES
(1, 14, 10000000.00, 200000.00, '2026-04-04 14:11:09'),
(2, 15, 10000000.00, 200000.00, '2026-04-04 14:11:46'),
(3, 16, 10000000.00, 200000.00, '2026-04-04 14:14:11'),
(4, 17, 10000000.00, 200000.00, '2026-04-04 14:18:22'),
(5, 18, 10000000.00, 200000.00, '2026-04-04 14:18:43'),
(6, 19, 10000000.00, 200000.00, '2026-04-04 14:35:00'),
(7, 3, 10000.00, 500.00, '2026-04-04 15:19:09');

-- --------------------------------------------------------

--
-- Table structure for table `dompet`
--

CREATE TABLE `dompet` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `nama_dompet` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `saldo` decimal(15,2) DEFAULT '0.00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dompet`
--

INSERT INTO `dompet` (`id`, `user_id`, `nama_dompet`, `saldo`, `created_at`) VALUES
(1, 12, 'Dompet Utama', 1900000.00, '2026-04-04 14:09:40'),
(3, 13, 'Dompet Utama', 1400000.00, '2026-04-04 14:10:12'),
(5, 14, 'Dompet Utama', 1200000.00, '2026-04-04 14:11:08'),
(7, 15, 'Dompet Utama', 1200000.00, '2026-04-04 14:11:46'),
(9, 16, 'Dompet Utama', 1150000.00, '2026-04-04 14:14:11'),
(11, 17, 'Dompet Utama', 1150000.00, '2026-04-04 14:18:21'),
(13, 18, 'Dompet Utama', 1150000.00, '2026-04-04 14:18:42'),
(15, 19, 'Dompet Utama', 1150000.00, '2026-04-04 14:35:00'),
(17, 3, 'BANK', 949500.00, '2026-04-04 15:02:17'),
(18, 20, 'BANK', 9500.00, '2026-04-04 16:05:32');

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id` int NOT NULL,
  `nama_kategori` varchar(255) NOT NULL,
  `tipe` enum('Pemasukan','Pengeluaran') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`id`, `nama_kategori`, `tipe`) VALUES
(1, 'Gaji', 'Pemasukan'),
(2, 'Makanan', 'Pengeluaran'),
(3, 'Transportasi', 'Pengeluaran');

-- --------------------------------------------------------

--
-- Table structure for table `target_finansial`
--

CREATE TABLE `target_finansial` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `nama_target` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `jumlah_target` decimal(15,2) NOT NULL,
  `terkumpul` decimal(15,2) DEFAULT '0.00',
  `tanggal_tercapai` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `target_finansial`
--

INSERT INTO `target_finansial` (`id`, `user_id`, `nama_target`, `jumlah_target`, `terkumpul`, `tanggal_tercapai`, `created_at`) VALUES
(1, 2, 'Beli Laptop Baru', 10000000.00, 0.00, '2024-12-31', '2026-04-04 02:27:57'),
(10, 3, 'Iphone', 20000000.00, 10000.00, NULL, '2026-04-04 15:20:23'),
(11, 20, 'dwadwa', 21.00, 0.00, NULL, '2026-04-04 16:01:15');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `dompet_id` int DEFAULT NULL,
  `kategori_id` int DEFAULT NULL,
  `jenis` enum('Pemasukan','Pengeluaran','Tabungan') COLLATE utf8mb4_general_ci NOT NULL,
  `tipe` enum('AWAL','BARU','RUTIN') COLLATE utf8mb4_general_ci NOT NULL,
  `is_berulang` tinyint(1) DEFAULT '0',
  `selected_days` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `limit_date` date DEFAULT NULL,
  `jumlah` decimal(15,2) NOT NULL,
  `tanggal` date NOT NULL,
  `keterangan` text COLLATE utf8mb4_general_ci,
  `target_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaksi`
--

INSERT INTO `transaksi` (`id`, `user_id`, `dompet_id`, `kategori_id`, `jenis`, `tipe`, `is_berulang`, `selected_days`, `limit_date`, `jumlah`, `tanggal`, `keterangan`, `target_id`, `created_at`) VALUES
(1, 2, NULL, NULL, 'Pemasukan', 'AWAL', 0, NULL, NULL, 1500000.00, '2023-11-01', 'Saldo awal', NULL, '2026-04-04 02:11:58'),
(2, 2, NULL, NULL, 'Pemasukan', 'BARU', 0, NULL, NULL, 500000.00, '2023-11-05', 'Bonus desain UI/UX', NULL, '2026-04-04 02:17:48'),
(3, 2, NULL, NULL, 'Pengeluaran', 'BARU', 0, NULL, NULL, 35000.00, '2023-11-06', 'Makan di Warteg', NULL, '2026-04-04 02:18:11'),
(4, 2, NULL, NULL, 'Tabungan', 'BARU', 0, NULL, NULL, 500000.00, '2023-11-10', 'Nabung bulan pertama', 1, '2026-04-04 02:30:11'),
(5, 13, 3, NULL, 'Tabungan', 'BARU', 0, NULL, NULL, 500000.00, '2026-04-04', NULL, NULL, '2026-04-04 14:10:12'),
(6, 14, 5, NULL, 'Tabungan', 'BARU', 0, NULL, NULL, 200000.00, '2026-04-04', NULL, NULL, '2026-04-04 14:11:09'),
(7, 14, 5, NULL, 'Tabungan', 'BARU', 0, NULL, NULL, 500000.00, '2026-04-04', NULL, NULL, '2026-04-04 14:11:09'),
(8, 15, 7, NULL, 'Tabungan', 'BARU', 0, NULL, NULL, 200000.00, '2026-04-04', NULL, NULL, '2026-04-04 14:11:46'),
(9, 15, 7, NULL, 'Tabungan', 'BARU', 0, NULL, NULL, 500000.00, '2026-04-04', NULL, NULL, '2026-04-04 14:11:47'),
(11, 16, 9, NULL, 'Pengeluaran', 'BARU', 0, NULL, NULL, 50000.00, '2026-04-04', NULL, NULL, '2026-04-04 14:14:11'),
(12, 16, 9, NULL, 'Tabungan', 'BARU', 0, NULL, NULL, 200000.00, '2026-04-04', NULL, NULL, '2026-04-04 14:14:11'),
(13, 16, 9, NULL, 'Tabungan', 'BARU', 0, NULL, NULL, 500000.00, '2026-04-04', NULL, NULL, '2026-04-04 14:14:12'),
(15, 17, 11, NULL, 'Pengeluaran', 'BARU', 0, NULL, NULL, 50000.00, '2026-04-04', NULL, NULL, '2026-04-04 14:18:21'),
(16, 17, 11, NULL, 'Tabungan', 'BARU', 0, NULL, NULL, 200000.00, '2026-04-04', NULL, NULL, '2026-04-04 14:18:22'),
(17, 17, 11, NULL, 'Tabungan', 'BARU', 0, NULL, NULL, 500000.00, '2026-04-04', NULL, NULL, '2026-04-04 14:18:22'),
(19, 18, 13, NULL, 'Pengeluaran', 'BARU', 0, NULL, NULL, 50000.00, '2026-04-04', NULL, NULL, '2026-04-04 14:18:43'),
(20, 18, 13, NULL, 'Tabungan', 'BARU', 0, NULL, NULL, 200000.00, '2026-04-04', NULL, NULL, '2026-04-04 14:18:43'),
(21, 18, 13, NULL, 'Tabungan', 'BARU', 0, NULL, NULL, 500000.00, '2026-04-04', NULL, NULL, '2026-04-04 14:18:43'),
(23, 19, 15, NULL, 'Pengeluaran', 'BARU', 0, NULL, NULL, 50000.00, '2026-04-04', NULL, NULL, '2026-04-04 14:35:00'),
(24, 19, 15, NULL, 'Tabungan', 'BARU', 0, NULL, NULL, 200000.00, '2026-04-04', NULL, NULL, '2026-04-04 14:35:00'),
(25, 19, 15, NULL, 'Tabungan', 'BARU', 0, NULL, NULL, 500000.00, '2026-04-04', NULL, NULL, '2026-04-04 14:35:01'),
(26, 3, 17, 2, 'Pengeluaran', 'BARU', 0, NULL, NULL, 10000.00, '2026-04-04', 'Beli Mie Ayam', NULL, '2026-04-04 15:11:25'),
(27, 3, 17, NULL, 'Tabungan', 'BARU', 0, NULL, NULL, 500.00, '2026-04-04', NULL, NULL, '2026-04-04 15:19:43'),
(28, 3, 17, NULL, 'Tabungan', 'BARU', 0, NULL, NULL, 10000.00, '2026-04-04', NULL, 10, '2026-04-04 15:20:55'),
(29, 3, 17, 3, 'Pengeluaran', 'RUTIN', 1, '5,15,25', '2026-05-31', 30000.00, '2026-04-04', 'beli bensin', NULL, '2026-04-04 15:44:30'),
(30, 20, 18, 2, 'Pengeluaran', 'BARU', 0, NULL, NULL, 500.00, '2026-04-04', 'Weci', NULL, '2026-04-04 16:05:52');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `first_name`, `last_name`, `password`, `created_at`) VALUES
(1, 'admin', NULL, NULL, '$2y$10$VvvHJSc/dM3AsqK2ztjCN.QM9iBYA5T7rrlLHsNn/h5H05eIIXL/O', '2026-04-02 03:10:38'),
(2, 'Budi', NULL, NULL, '$2y$10$SYGh2rWSjggbsTsj2TOJEOP13AH4dbzw15VLiqDT/SdYwUgBg.gSy', '2026-04-04 01:55:47'),
(3, 'admin2', NULL, NULL, '$2y$10$pUKNaYEqU/3A5vPDpJyocu3GwjtMn0E0MPs9.npjN1Z.D/NfErDIW', '2026-04-04 03:22:42'),
(4, 'admin_test', NULL, NULL, '$2y$10$UaKEs2AnCZFUw2ZUdUG.7.h5tDWVUX1s1m9Ka1hfKxCOQaWlOfMeC', '2026-04-04 13:55:07'),
(5, 'tester_89f0cea5', NULL, NULL, '$2y$10$hvV8br5qA7dwl0tBZLn5r./UmcMbzoTwUWy7HMXtUCR7Lu0zf7ts2', '2026-04-04 13:56:20'),
(6, 'tester_e0578e5e', NULL, NULL, '$2y$10$iqpp1H1ok0AMSXQ84pBbR.pXnm1x7K9P7otHGp9cpduoaE6zr3kX2', '2026-04-04 13:56:45'),
(7, 'tester_cb70b932', NULL, NULL, '$2y$10$Q.T.tAPnnVXaA4CBdR6ZnOWwVxdOPlZhc3mC2ftt2VpY9A/UXyPTK', '2026-04-04 13:57:41'),
(8, 'tester_469de508', NULL, NULL, '$2y$10$fHd27SK6pCak4bZ4ZipGke/PBjZDdiGSLTx2TnUrpeRDcpnlPIdzy', '2026-04-04 14:00:30'),
(9, 'tester_d6aba828', NULL, NULL, '$2y$10$THVogUPaZ4BZQYaFMFguIO1ePTMof3p7pEjII9UZ3DWwbzDQbJFLi', '2026-04-04 14:01:44'),
(10, 'tester_7135e897', NULL, NULL, '$2y$10$aM5NT0P6Rkkow8/AKu25w.StZbRv9aSAQojPne3xI.mys3mkOpMS.', '2026-04-04 14:02:25'),
(11, 'tester_0c44ef91', NULL, NULL, '$2y$10$wX7xFqyeFvD8tU3F4gh/CezNS0SMojmduDHR073Udjc4ETUuGZQPq', '2026-04-04 14:02:39'),
(12, 'tester_d186fe7a', NULL, NULL, '$2y$10$ypJXE.Uz/P7.FoTPXJwN3eNdetXsmnO6EGyAyJP1QvGGFdGo3a2q2', '2026-04-04 14:09:40'),
(13, 'tester_14d1a3b1', NULL, NULL, '$2y$10$NQxDq1d8rYDDLMwN3gbeQ.pzgPZmx4Ue6ovcogwP1a.L25MVyVKve', '2026-04-04 14:10:11'),
(14, 'tester_d7179a7e', NULL, NULL, '$2y$10$0T5v5S72YvgHEq/FHm2gFenzOvs9K/cZGJ36M/HP9VVq8WRURVjBO', '2026-04-04 14:11:08'),
(15, 'tester_ce05f49a', NULL, NULL, '$2y$10$NHBaEClR9uhhXekJ1XuRKObd3BztGeO9uYLJpHlrhXoFe.jWe992C', '2026-04-04 14:11:46'),
(16, 'tester_78f39296', NULL, NULL, '$2y$10$.rpfRZm6cFGiALbBdeGQU.eba05M0kgBlomzZrOOAIiRXNynFb00y', '2026-04-04 14:14:10'),
(17, 'tester_7cee123b', NULL, NULL, '$2y$10$rmRFDj5ZV0OsC92lRBOqreuPi5rkj78f55YcG7yDh5LYFNLce9R2u', '2026-04-04 14:18:20'),
(18, 'tester_80d12523', NULL, NULL, '$2y$10$hCNWlXGS0VSOcOYp417Jie1jiXQhFoux7rPm12O3Nsky6/hVKYJFC', '2026-04-04 14:18:42'),
(19, 'tester_5141052d', NULL, NULL, '$2y$10$a0vOFw72CTDfGmDoUPE12eZdVnLAZ3XAJakdenDNnsEInLkShI1eq', '2026-04-04 14:34:59'),
(20, 'test@example.com', NULL, NULL, '$2y$10$3TwRKZzpK1oMahlkpWk88uhE92jqXFExT91KJbU12RFzjjaYMbqHK', '2026-04-04 15:50:36');

--
-- Indexes for dumped tables
--

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
  ADD KEY `dompet_ibfk_1` (`user_id`);

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
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `target_id` (`target_id`);

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
-- AUTO_INCREMENT for table `dana_darurat`
--
ALTER TABLE `dana_darurat`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `dompet`
--
ALTER TABLE `dompet`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `target_finansial`
--
ALTER TABLE `target_finansial`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

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
-- Constraints for table `target_finansial`
--
ALTER TABLE `target_finansial`
  ADD CONSTRAINT `target_finansial_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transaksi_ibfk_2` FOREIGN KEY (`target_id`) REFERENCES `target_finansial` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
