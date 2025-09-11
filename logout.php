<?php
// File: logout.php
// Bertugas untuk mengakhiri sesi login pengguna.

// Selalu mulai session di awal, bahkan saat akan menghancurkannya.
session_start();

// Hapus semua variabel session yang tersimpan.
$_SESSION = array();

// Hancurkan session-nya.
session_destroy();

// Arahkan pengguna kembali ke halaman login setelah berhasil logout.
header("Location: login.php");
exit();
?>