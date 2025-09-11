<?php
// File: login.php
// Bertugas untuk menangani proses login pengguna.

// Session harus dimulai di paling atas halaman, sebelum ada output apapun.
// Session digunakan untuk mengingat pengguna yang sudah berhasil login.
session_start();

// Jika pengguna sudah login (ada session 'user_id'),
// langsung arahkan ke dashboard agar tidak perlu login lagi.
if (isset($_SESSION['user_id'])) {
    header("Location: dashboard.php");
    exit();
}

// Memanggil file koneksi untuk terhubung ke database.
require 'utils/connection.php';

// Inisialisasi variabel untuk menyimpan pesan error.
$error_message = '';

// Cek apakah form telah disubmit.
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Ambil data dari form.
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Validasi sederhana, cek apakah input kosong.
    if (empty($username) || empty($password)) {
        $error_message = "Username dan password wajib diisi!";
    } else {
        // Lanjutkan jika tidak kosong.
        // Siapkan query untuk mencari user berdasarkan username.
        $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        // Cek apakah user ditemukan (ada 1 baris hasil).
        if ($result->num_rows === 1) {
            // Jika user ada, ambil datanya.
            $user = $result->fetch_assoc();

            // Verifikasi password yang diinput dengan hash password di database.
            if (password_verify($password, $user['password'])) {
                // Jika password cocok, login berhasil!
                
                // Simpan informasi penting pengguna ke dalam session.
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                
                // Arahkan pengguna ke halaman dashboard.
                header("Location: dashboard.php");
                exit();
            } else {
                // Jika password salah.
                $error_message = "Username atau password salah!";
            }
        } else {
            // Jika username tidak ditemukan.
            $error_message = "Username atau password salah!";
        }
        // Tutup statement dan koneksi
        $stmt->close();
        $conn->close();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="public/css/auth-style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <title>Login | Kelola Uang</title>
</head>
<body>
    <img src="public/asset/Logo-Icons.png" alt="kelola Uang Logo">
    <div>
        <h1>Login</h1>
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
            <button type="submit">Masuk</button>
            <p style="text-align: center; margin-top: 30px;" >Belum punya akun? <a href="register.php" style="color: var(--primary--500); text-decoration: none;">Klik Disini</a></p>
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