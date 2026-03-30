# Panduan Produksi Aplikasi Kelola Uang Pribadi

Dokumen ini berisi langkah-langkah untuk melakukan deployment aplikasi Anda ke server produksi (hosting/vps).

## Langkah 1: Persyaratan Server
- PHP versi 8.1 atau lebih tinggi.
- MySQL atau MariaDB.
- Web Server (Apache disarankan karena sudah ada `.htaccess`).

## Langkah 2: Persiapan File
1.  **Build Frontend**: Pastikan Anda sudah menjalankan perintah `npm run build` di dalam folder `frontend/`. Perintah ini akan menghasilkan folder `frontend/dist/`.
2.  **Upload**: Upload seluruh folder proyek (termasuk `app/`, `public/`, `routes/`, `frontend/dist/`, `.env`, dll.) ke folder `public_html` atau root domain di server Anda.

> [!IMPORTANT]
> Jangan upload folder `frontend/node_modules/` atau `frontend/src/` ke server produksi untuk menghemat ruang dan meningkatkan keamanan. Cukup folder `frontend/dist/` saja.

## Langkah 3: Konfigurasi Environment (`.env`)
Di server produksi, edit file `.env` dan sesuaikan dengan database server Anda:
```env
DB_HOST=localhost
DB_NAME=nama_database_anda
DB_USER=username_database_anda
DB_PASS=password_database_anda
APP_ENV=production
```

## Langkah 4: Pengaturan Database
1.  Buat database di hosting Anda (melalui cPanel/phpMyAdmin).
2.  Import file `database/uangmu_app_db.sql` ke dalam database baru tersebut.

## Langkah 5: Pengaturan Web Server (Apache)
Pastikan folder `public/` adalah root yang diakses oleh publik. Anda bisa menggunakan file `.htaccess` di root proyek untuk mengarahkan semua traffic ke `public/index.php`.

Contoh isi `.htaccess` di root proyek:
```apache
RewriteEngine On
RewriteRule ^(.*)$ public/index.php [L]
```

## Langkah 6: Keamanan Tambahan
- Pastikan file `.env` tidak dapat diakses langsung dari browser (sudah ditangani oleh routing di `index.php`).
- Gunakan SSL (HTTPS) untuk keamanan data transaksi keuangan pengguna.

---
