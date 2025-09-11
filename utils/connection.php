<?php
// File: utils/connection.php
// Berfungsi untuk membuat dan mengelola koneksi ke database MySQL.

// Konfigurasi Database
$db_host = "localhost";    // Biasanya "localhost" jika menggunakan XAMPP
$db_user = "root";         // User default MySQL di XAMPP
$db_pass = "";             // Password default MySQL di XAMPP biasanya kosong
$db_name = "uangmu_app_db"; // Nama database yang sudah kita buat

// Membuat koneksi menggunakan MySQLi
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Memeriksa apakah koneksi berhasil atau gagal
if ($conn->connect_error) {
    // Jika koneksi gagal, hentikan eksekusi script dan tampilkan pesan error.
    // Ini penting untuk debugging.
    die("Koneksi ke database gagal: " . $conn->connect_error);
}

// Set karakter set ke utf8mb4 untuk mendukung berbagai macam karakter
$conn->set_charset("utf8mb4");