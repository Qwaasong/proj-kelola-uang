# Aplikasi Kelola Uang Pribadi

Aplikasi berbasis web untuk membantu pengelolaan keuangan pribadi (pemasukan, pengeluaran, dan saldo) dengan arsitektur decoupled: PHP sebagai backend API dan React sebagai frontend SPA.

## Struktur Proyek

Berikut adalah gambaran umum struktur direktori aplikasi:

- **app/**: Inti logika aplikasi (Backend).
  - config/: Konfigurasi basis data.
  - controllers/: Logika bisnis dan validasi input.
  - core/: Utilitas sistem inti.
  - handlers/: Penghubung antara API dan logika controller.
  - models/: Interaksi langsung dengan database (CRUD).
- **database/**: Berisi file skema SQL (uangmu_app_db.sql).
- **frontend/**: Aplikasi frontend berbasis React + TypeScript + Vite.
- **public/**: Folder publik untuk entry point API.
  - index.php: Entry point utama untuk request API.
- **routes/**: Berisi api.php untuk mengatur endpoint API.

## Cara Instalasi dan Menjalankan Aplikasi

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di komputer lokal Anda:

### 1. Persiapan Basis Data

1. Buka tool manajemen database Anda (seperti phpMyAdmin).
2. Buat database baru dengan nama yang sesuai (misal: uangmu_app_db).
3. Import file database/uangmu_app_db.sql ke dalam database tersebut.
4. Sesuaikan konfigurasi database di app/config/ jika diperlukan.

### 2. Menjalankan Backend (PHP)

1. Pastikan server PHP Anda aktif (seperti XAMPP, Laragon, atau PHP built-in server).
2. Arahkan root server Anda ke folder public/.
3. Jika menggunakan PHP built-in server, jalankan perintah ini di root folder proyek:
   php -S localhost:80 -t public
4. Pastikan backend berjalan dan bisa diakses di http://localhost/api/user.

### 3. Menjalankan Frontend (React)

1. Buka terminal baru dan masuk ke direktori frontend:
   cd frontend
2. Install semua dependencies yang diperlukan:
   npm install
3. Jalankan development server untuk React:
   npm run dev
4. Buka browser dan akses URL yang muncul di terminal (biasanya http://localhost:5173).

## Alur Kerja Pengembangan vs Produksi

Sekarang aplikasi mendukung dua mode utama yang dapat diatur melalui file `.env`:

### 1. Mode Pengembangan (Development)
Gunakan mode ini saat Anda sedang aktif menulis kode:
- **Set `.env`**: `APP_ENV=development`
- **Jalankan Backend**: `php -S localhost:80 -t public`
- **Jalankan Frontend**: `cd frontend && npm run dev`
- **Akses**: Buka `http://localhost:5173` di browser. Vite akan meneruskan (proxy) request API ke backend secara otomatis.

### 2. Mode Produksi (Production)
Gunakan mode ini untuk simulasi deployment atau pengumpulan tugas akhir:
- **Set `.env`**: `APP_ENV=production`
- **Build**: Jalankan `npm run build` di folder `frontend/`.
- **Jalankan Server**: Cukup jalankan PHP server `php -S localhost:80 -t public`.
- **Akses**: Buka `http://localhost/` langsung. Backend PHP akan melayani file React yang sudah di-build dari folder `dist/`.

---

Link tutorial khusus produksi: [PRODUCTION_GUIDE.md](file:///d:/Dokumen%20Sekolah%2012/UKK/proj-kelola-uang/PRODUCTION_GUIDE.md)

