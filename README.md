# Aplikasi Kelola Uang Pribadi 

Aplikasi berbasis web untuk membantu pengelolaan keuangan pribadi (pemasukan, pengeluaran, dan saldo) dengan struktur MVC custom yang ringan.

##  Struktur Proyek

Berikut adalah gambaran umum struktur direktori aplikasi:

- **`app/`**: Inti logika aplikasi.
  - `config/`: Konfigurasi basis data.
  - `controllers/`: Logika bisnis dan validasi input.
  - `core/`: Utilitas sistem inti (seperti `Response.php`).
  - `handlers/`: Penghubung antara view dan logika controller.
  - `models/`: Interaksi langsung dengan database (CRUD).
  - `messages/`: Manajemen pesan feedback (success/error).
- **`database/`**: Berisi file skema SQL (`uangmu_app_db.sql`).
- **`public/`**: Folder publik yang dapat diakses browser.
  - `views/`: Template tampilan UI.
  - `css/`, `js/`, `asset/`: File statis pendukung.
  - `index.php`: Entry point utama aplikasi.
- **`routes/`**: Berisi `web.php` untuk mengatur navigasi URL.

##  Alur Kerja Aplikasi (Request Flow)

Aplikasi ini menggunakan pola **Front Controller** dengan router sederhana:

1. **Request Intake**: Semua request masuk melalui `public/index.php`.
2. **Routing**: `index.php` memanggil `routes/web.php` yang memeriksa URL menggunakan `switch-case`.
3. **Controller/View Loading**:
   - Jika rute adalah dashboard, `DashboardController` dipanggil untuk mengambil data.
   - Jika rute adalah form (seperti login/register), view terkait di `public/views/` akan dimuat.
4. **Data Processing**:
   - Form submission ditangani oleh file di `app/handlers/`.
   - Handler memanggil `Controller` untuk validasi dan logika.
   - Controller berinteraksi dengan `UserModel` untuk operasi database.
5. **Response**: Hasil (view atau redirect) dikirim kembali ke browser melalui `app/core/Response.php`.

##  Alur Autentikasi

- **Login**: `login.php` -> `login_handler.php` -> `UserLoginValidationController` -> `UserLoginLogicController` -> `UserModel`.
- **Register**: `register.php` -> `user_handler.php` -> `UserValidationController` -> `UserLogicController` -> `UserModel`.

##  Basis Data

Skema database tersimpan di `database/uangmu_app_db.sql`. Pastikan untuk mengimpor file ini ke MySQL Anda sebelum menjalankan aplikasi.

---
*Dikembangkan untuk keperluan UKK (Uji Kompetensi Keahlian).*