# Laeva - Project Kelola Uang

Aplikasi manajemen keuangan pribadi yang dibangun menggunakan React (Vite) untuk Frontend dan PHP Native untuk Backend.

## Persyaratan Sistem

- PHP 8.0 atau lebih baru
- Node.js 16 atau lebih baru
- MySQL / MariaDB
- Server Apache (Opsional untuk development, disarankan untuk production)

## Persiapan Database

1. Buat database baru di MySQL dengan nama `uangmu_app_db`.
2. Impor file database yang terletak di folder `database/` (jika ada) atau sesuaikan konfigurasi tabel.
3. Sesuaikan konfigurasi database di file `.env`.

---

## Mode Pengembangan (Development)

Mode ini digunakan saat Anda melakukan modifikasi kode atau menjalankan aplikasi secara lokal.

### Langkah-langkah Menjalankan:

1. Pastikan Anda berada di mode development dengan menjalankan perintah berikut di PowerShell (root project):
   ```powershell
   .\switch-mode.ps1 dev
   ```

2. Jalankan Backend (Pilih salah satu):
   - Opsi A (PHP CLI): `php -S localhost:8000 -t public public/index.php`
   - Opsi B (XAMPP): Pastikan Apache dan MySQL sudah menyala di XAMPP.

3. Jalankan Frontend:
   - Masuk ke folder frontend: `cd frontend`
   - Jalankan dev server: `npm run dev`

4. Akses aplikasi:
   Buka browser dan buka alamat `http://localhost:5173`.

---

## Mode Produksi (Production)

Mode ini digunakan saat aplikasi siap untuk diunggah ke hosting atau server asli.

### Langkah-langkah Persiapan:

1. Beralih ke mode production:
   ```powershell
   .\switch-mode.ps1 prod
   ```

2. Bangun (Build) Frontend:
   - Masuk ke folder frontend: `cd frontend`
   - Jalankan build: `npm run build`

3. Pindahkan hasil build:
   Salin semua isi folder `frontend/dist/` ke dalam folder `public/` di root project.

4. Unggah ke Server:
   Unggah seluruh isi folder root project (kecuali folder `frontend/`) ke direktori web server Anda (misal: `public_html` atau `/var/www/html`).

---

## Utilitas Script

Tersedia script `switch-mode.ps1` untuk mempermudah perpindahan konfigurasi antara mode development dan production secara otomatis.

Cara penggunaan:
- `.\switch-mode.ps1 dev` : Mengaktifkan mode pengembangan.
- `.\switch-mode.ps1 prod` : Mengaktifkan mode produksi.
- `.\switch-mode.ps1 status` : Mengecek mode yang sedang aktif saat ini.
