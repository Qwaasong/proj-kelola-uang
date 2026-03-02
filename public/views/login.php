<?php
// Session harus dimulai di paling atas halaman
session_start();

// Jika pengguna sudah login, langsung arahkan ke dashboard
if (isset($_SESSION['user_id'])) {
    header("Location: /dashboard");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/auth-style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <title>Login | Kelola Uang</title>
</head>

<body>
    <img src="/asset/Logo-Icons.png" alt="kelola Uang Logo">
    <div>
        <h1>Login</h1>
        <form id="loginForm">

            <p id="errorMessage" style="color: red; text-align: center; margin-bottom: 15px; display: none;"></p>
            <p id="successMessage" style="color: green; text-align: center; margin-bottom: 15px; display: none;"></p>

            <p>Nama Pengguna</p>
            <div class="input-container">
                <i class="fa-solid fa-user"></i>
                <input type="text" id="username" name="username" placeholder="Nama Pengguna" required>
            </div>

            <p>Kata Sandi</p>
            <div class="input-container">
                <i class="fa-solid fa-lock"></i>
                <input type="password" id="password" name="password" placeholder="Kata Sandi" required>
                <span class="toggle-password" onclick="togglePassword(this)">
                    <i class="fa-solid fa-eye"></i>
                </span>
            </div>

            <button type="submit" id="submitBtn">Masuk</button>
            <p style="text-align: center; margin-top: 30px;">Belum punya akun? <a href="/register"
                    style="color: var(--primary--500); text-decoration: none;">Klik Disini</a></p>
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

    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const btn = document.getElementById('submitBtn');
        const errBox = document.getElementById('errorMessage');
        const succBox = document.getElementById('successMessage');

        errBox.style.display = 'none';
        succBox.style.display = 'none';
        btn.disabled = true;
        btn.innerText = 'Loading...';

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (!response.ok || !result.status) {
                errBox.innerText = result.message || 'Login gagal';
                errBox.style.display = 'block';
            } else {
                succBox.innerText = 'Login berhasil! Mengalihkan...';
                succBox.style.display = 'block';
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 500);
            }
        } catch (error) {
            errBox.innerText = 'Gagal terhubung ke server.';
            errBox.style.display = 'block';
        } finally {
            if (!succBox.style.display || succBox.style.display === 'none') {
                btn.disabled = false;
                btn.innerText = 'Masuk';
            }
        }
    });
</script>

</html>