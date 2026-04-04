DOKUMENTASI API BACKEND KELOLA UANG (V1)
--------------------------------------------------

INFORMASI UMUM
- Base URL : http://localhost/proj-kelola-uang/public/api
- Method   : POST (Berlaku untuk semua endpoint)
- Format   : raw JSON

==================================================
1. AUTENTIKASI
==================================================
A. Register
   - Endpoint : /register
   - Wajib    : username, password, confirm_password

B. Login
   - Endpoint : /login
   - Wajib    : username, password
   - Return   : Data user (termasuk user_id)

==================================================
2. TRANSAKSI UTAMA
==================================================
A. Tambah Transaksi Awal
   - Endpoint : /transaksi/awal
   - Wajib    : user_id, nama_transaksi, jenis (Pemasukan / Pengeluaran), jumlah, tanggal
   - Opsional : keterangan

B. Tambah Transaksi Baru (Sehari-hari)
   - Endpoint : /transaksi/baru
   - Wajib    : user_id, nama_transaksi, jenis (Pemasukan / Pengeluaran), jumlah, tanggal
   - Opsional : keterangan

C. Tambah Tabungan
   - Endpoint : /transaksi/tabungan
   - Wajib    : user_id, jumlah, tanggal
   - Opsional : keterangan, target_id

==================================================
3. TRANSAKSI BERULANG (RUTIN)
==================================================
A. Pemasukan Berulang
   - Endpoint : /recurring/pemasukan
   - Wajib    : user_id, nama_pemasukan, jumlah, frekuensi, tanggal_mulai

B. Pengeluaran Berulang
   - Endpoint : /recurring/pengeluaran
   - Wajib    : user_id, nama_pengeluaran, jumlah, frekuensi, tanggal_mulai

==================================================
4. TARGET FINANSIAL
==================================================
A. Buat Target Baru
   - Endpoint : /target
   - Wajib    : user_id, nama_target, jumlah_target
   - Opsional : tanggal_tercapai

==================================================
5. LAPORAN & DASHBOARD
==================================================
A. Ringkasan Saldo Terkini
   - Endpoint : /laporan/ringkasan
   - Wajib    : user_id
   - Return   : Total pemasukan, pengeluaran, tabungan, dan saldo akhir

B. Riwayat Transaksi
   - Endpoint : /laporan/riwayat
   - Wajib    : user_id
   - Opsional : jenis, tanggal_mulai, tanggal_selesai (digunakan untuk filter)
   - Return   : List data riwayat transaksi berurutan dari yang terbaru
