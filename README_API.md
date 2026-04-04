
PANDUAN TEKNIS API UNTUK FRONTEND

STANDAR REQUEST
- Base URL     : http://localhost/proj-kelola-uang/public/api
- Method       : POST
- Header       : Content-Type: application/json
- Format Date  : YYYY-MM-DD (Contoh: 2023-11-25)
- Format Money : Angka murni tanpa simbol (Contoh: 1500000)

STANDAR RESPONSE
Setiap respon akan dibungkus dalam format:
{
    "status": (kode_http),
    "message": ("success" atau "error"),
    "data": (objek_data atau pesan_error)
}

DAFTAR ENDPOINT UTAMA
(Sertakan daftar endpoint yang sudah rapi sebelumnya di sini)

CATATAN PENTING
1. Login akan mengembalikan "id". Simpan "id" tersebut di LocalStorage/State sebagai "user_id" untuk digunakan di semua transaksi lainnya.
2. Field "jenis" pada transaksi hanya menerima input: "Pemasukan", "Pengeluaran", atau "Tabungan".
3. Field "frekuensi" pada recurring hanya menerima: "Harian", "Mingguan", "Bulanan", atau "Tahunan".



1. AUTENTIKASI

A. Register
Endpoint : /register
Wajib    : username, password, confirm_password

B. Login
Endpoint : /login
Wajib    : username, password
Return   : Data user (termasuk id sebagai user_id)


2. TRANSAKSI UTAMA

A. Tambah Transaksi Awal
Endpoint : /transaksi/awal
Wajib    : user_id, nama_transaksi, jenis (Pemasukan atau Pengeluaran), jumlah, tanggal
Opsional : keterangan

B. Tambah Transaksi Baru (Sehari-hari)
Endpoint : /transaksi/baru
Wajib    : user_id, nama_transaksi, jenis (Pemasukan atau Pengeluaran), jumlah, tanggal
Opsional : keterangan

C. Tambah Tabungan
Endpoint : /transaksi/tabungan
Wajib    : user_id, jumlah, tanggal
Opsional : keterangan, target_id


3. TRANSAKSI BERULANG (RUTIN)

A. Pemasukan Berulang
Endpoint : /recurring/pemasukan
Wajib    : user_id, nama_pemasukan, jumlah, frekuensi, tanggal_mulai

B. Pengeluaran Berulang
Endpoint : /recurring/pengeluaran
Wajib    : user_id, nama_pengeluaran, jumlah, frekuensi, tanggal_mulai


4. TARGET FINANSIAL

A. Buat Target Baru
Endpoint : /target
Wajib    : user_id, nama_target, jumlah_target
Opsional : tanggal_tercapai


5. LAPORAN DAN DASHBOARD

A. Ringkasan Saldo Terkini
Endpoint : /laporan/ringkasan
Wajib    : user_id
Return   : Total pemasukan, pengeluaran, tabungan, dan saldo akhir

B. Riwayat Transaksi
Endpoint : /laporan/riwayat
Wajib    : user_id
Opsional : jenis, tanggal_mulai, tanggal_selesai (untuk filter data)
Return   : List riwayat transaksi berurutan dari yang terbaru


PENJELASAN:
- Wajib    : Data ini harus dikirim. Jika tidak dikirim, API akan menolak dan error.
- Opsional : Data ini bebas, boleh dikosongkan atau tidak dikirim sama sekali.
