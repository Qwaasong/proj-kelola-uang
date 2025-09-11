<?php
// File: register.php
// Bertugas untuk menangani proses pendaftaran pengguna baru.

// Memanggil file koneksi agar bisa terhubung ke database.
require 'utils/connection.php';

// Inisialisasi variabel untuk menyimpan pesan error.
$error_message = '';

// Cek apakah request yang masuk adalah POST, artinya form telah disubmit.
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Ambil data dari form dan bersihkan dari spasi yang tidak perlu.
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password']; // Ambil konfirmasi password dari form.

    // --- Validasi Sederhana ---
    // 1. Cek apakah ada field yang kosong.
    if (empty($username) || empty($password) || empty($confirm_password)) {
        $error_message = "Semua kolom wajib diisi!";
    }
    // 2. Cek apakah password dan konfirmasi password cocok.
    elseif ($password !== $confirm_password) {
        $error_message = "Password dan konfirmasi password tidak cocok!";
    }
    // 3. Cek apakah username sudah ada di database.
    else {
        // Gunakan prepared statement untuk keamanan dari SQL Injection.
        $stmt_check = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $stmt_check->bind_param("s", $username);
        $stmt_check->execute();
        $stmt_check->store_result();

        if ($stmt_check->num_rows > 0) {
            $error_message = "Username sudah digunakan, silakan pilih yang lain.";
        } else {
            // --- Jika semua validasi lolos, lanjutkan proses registrasi ---

            // Enkripsi password sebelum disimpan ke database. Ini WAJIB untuk keamanan.
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            // Siapkan query INSERT dengan prepared statement.
            $stmt_insert = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
            $stmt_insert->bind_param("ss", $username, $hashed_password);

            // Eksekusi query INSERT.
            if ($stmt_insert->execute()) {
                // Jika berhasil, arahkan pengguna ke halaman login.
                header("Location: login.php");
                exit(); // Hentikan eksekusi script setelah redirect.
            } else {
                // Jika gagal, tampilkan pesan error.
                $error_message = "Terjadi kesalahan pada server. Coba lagi nanti.";
            }
            // Tutup statement insert
            $stmt_insert->close();
        }
        // Tutup statement check
        $stmt_check->close();
    }
    // Tutup koneksi database
    $conn->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="public/css/auth-style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <title>Register | Kelola Uang</title>
</head>
<body>
    <img src="public/asset/Logo-Icons.png" alt="kelola Uang Logo">
    <div>
        <h1>Register</h1>

        <form action="" method="post">
            
            <?php if (!empty($error_message)): ?>
                <p style="color: red; text-align: center; margin-bottom: 15px;"><?php echo $error_message; ?></p>
            <?php endif; ?>

            <p>Nama Pengguna</p>
            <div class="input-container">
                <i class="fa-solid fa-user"></i>
                <input type="text" name="username" placeholder="Nama Pengguna" required>
            </div>

            <p>Kata Sandi</p>
            <div class="input-container">
                <i class="fa-solid fa-lock"></i>
                <input type="password" id="password" name="password" placeholder="Kata Sandi" required>
                <span class="toggle-password" onclick="togglePassword(this)">
                    <i class="fa-solid fa-eye"></i>
                </span>
            </div>

            <p>Konfirmasi Kata Sandi</p>
            <div class="input-container">
                <i class="fa-solid fa-lock"></i>
                <input type="password" id="confirm_password" name="confirm_password" placeholder="Konfirmasi Kata Sandi" required>
                <span class="toggle-password" onclick="togglePassword(this)">
                    <i class="fa-solid fa-eye"></i>
                </span>
            </div>

            <button type="submit">Register</button>
            <p style="text-align: center; margin-top: 30px;">Sudah punya akun? <a href="login.php" style="color: var(--primary--500); text-decoration: none;">Login Disini</a></p>
        </form>
    </div>
    <p>Dibuat Dengan VS Code Oleh Kelompok 11</p>
    <p>© 2025 Kelola Uang</p>
</body>
    <script>
        function togglePassword(element) {
            const container = element.closest('.input-container');
            const passwordField = container.querySelector('input');
            const icon = element.querySelector('i');

            if (passwordField.type === "password") {
                passwordField.type = "text";
                icon.classList.replace("fa-eye", "fa-eye-slash");
            } else {
                passwordField.type = "password";
                icon.classList.replace("fa-eye-slash", "fa-eye");
            }
        }
    </script>
</html>