=========================================================
PANDUAN INTEGRASI API FRONTEND - KELOLA UANG APP
=========================================================

INFORMASI DASAR
- Base URL : http://localhost/proj-kelola-uang/public/api
- Format   : JSON (application/json)

ATURAN KEAMANAN (TOKEN JWT)
Semua API (kecuali halaman Login & Register) WAJIB mengirimkan token di bagian Header:
- Key   : Authorization
- Value : Bearer [isi_token_jwt_disini]


=========================================================
1. FITUR OTENTIKASI (Pendaftaran & Akses)
=========================================================

A. Daftar Akun Baru
- Lokasi Frontend : Halaman Register / Daftar
- Kegunaan        : Mendaftarkan user baru ke dalam database.
- Method          : POST
- URL             : http://localhost/proj-kelola-uang/public/api/otentikasi/daftar
- Body JSON       : username, password, confirm_password

B. Masuk (Login)
- Lokasi Frontend : Halaman Login
- Kegunaan        : Memvalidasi user dan menerbitkan Token JWT.
- Method          : POST
- URL             : http://localhost/proj-kelola-uang/public/api/otentikasi/masuk
- Body JSON       : username, password
- Return Data     : Token JWT dan ID User. (Simpan token ini di LocalStorage/Cookies).


=========================================================
2. FITUR DASHBOARD (Ringkasan Utama)
=========================================================

A. Ambil Data Dashboard
- Lokasi Frontend : Halaman Utama (Dashboard)
- Kegunaan        : Mengambil SEMUA data untuk chart, ringkasan saldo, dan riwayat singkat hanya dengan 1x panggil API (BFF Architecture).
- Method          : GET
- URL             : http://localhost/proj-kelola-uang/public/api/dashboard
- Query Opsional  : ?bulan=11&tahun=2023 (Jika tidak dikirim, otomatis pakai bulan saat ini)


=========================================================
3. FITUR DOMPET (Manajemen Sumber Dana)
=========================================================

A. Tampil Daftar Dompet
- Lokasi Frontend : Halaman Dompet (List Dompet & Saldo)
- Kegunaan        : Menampilkan semua nama dompet dan sisa saldonya.
- Method          : GET
- URL             : http://localhost/proj-kelola-uang/public/api/dompet

B. Tambah Dompet Baru
- Lokasi Frontend : Halaman Dompet (Tombol / Modal Tambah Dompet)
- Kegunaan        : Menyimpan data rekening/dompet baru beserta saldo awalnya.
- Method          : POST
- URL             : http://localhost/proj-kelola-uang/public/api/dompet
- Body JSON       : nama_dompet, saldo

C. Transfer Antar Dompet
- Lokasi Frontend : Halaman Dompet (Fitur Pindah Saldo)
- Kegunaan        : Memindahkan uang dari dompet A ke dompet B (saldo otomatis menyesuaikan).
- Method          : PUT
- URL             : http://localhost/proj-kelola-uang/public/api/dompet/transfer
- Body JSON       : dari_dompet_id, ke_dompet_id, jumlah


=========================================================
4. FITUR TRANSAKSI (Pemasukan & Pengeluaran)
=========================================================

A. Daftar Kategori
- Lokasi Frontend : Halaman Transaksi (Dropdown pilihan kategori saat input data)
- Kegunaan        : Mengambil list kategori dari database.
- Method          : GET
- URL             : http://localhost/proj-kelola-uang/public/api/kategori

B. Tampil Riwayat Transaksi
- Lokasi Frontend : Halaman Transaksi (Tabel riwayat utama)
- Kegunaan        : Menampilkan list transaksi lengkap dengan fitur Halaman (Pagination) dan Pencarian.
- Method          : GET
- URL             : http://localhost/proj-kelola-uang/public/api/transaksi
- Query Opsional  : ?page=1&limit=10&search=keyword

C. Catat Transaksi Baru
- Lokasi Frontend : Halaman Transaksi (Form tambah Pemasukan/Pengeluaran)
- Kegunaan        : Mencatat transaksi baru. Jika ditandai "is_berulang: true", transaksi akan dicatat sebagai rutin. Saldo dompet akan terpotong/bertambah otomatis.
- Method          : POST
- URL             : http://localhost/proj-kelola-uang/public/api/transaksi
- Body JSON Wajib : nama_transaksi, jenis (Pemasukan/Pengeluaran), jumlah, tanggal
- Body Opsional   : dompet_id, kategori_id, keterangan, is_berulang (true/false), frekuensi (Harian/Mingguan/Bulanan/Tahunan)

D. Edit Transaksi
- Lokasi Frontend : Halaman Transaksi (Modal Edit Data)
- Kegunaan        : Mengubah data transaksi yang salah input. Sistem akan otomatis mengkoreksi ulang saldo dompet.
- Method          : PUT
- URL             : http://localhost/proj-kelola-uang/public/api/transaksi
- Body JSON       : id (ID transaksi), nama_transaksi, jenis, jumlah, tanggal, dompet_id, kategori_id, keterangan, is_berulang, frekuensi


=========================================================
5. FITUR TARGET FINANSIAL (Goals)
=========================================================

A. Tampil Daftar Target
- Lokasi Frontend : Halaman Goals / Target
- Kegunaan        : Menampilkan semua impian/target beserta progress uang yang sudah terkumpul.
- Method          : GET
- URL             : http://localhost/proj-kelola-uang/public/api/target

B. Buat Target Baru
- Lokasi Frontend : Halaman Goals / Target (Form pembuatan)
- Kegunaan        : Membuat target nominal baru (Contoh: Beli Laptop Rp 10.000.000).
- Method          : POST
- URL             : http://localhost/proj-kelola-uang/public/api/target
- Body JSON       : nama_target, jumlah_target, tanggal_tercapai (opsional)

C. Nabung ke Target
- Lokasi Frontend : Halaman Goals / Target (Tombol Top-up / Nabung)
- Kegunaan        : Menambahkan uang ke target tertentu. Saldo di dompet asal akan OTOMATIS terpotong.
- Method          : PUT
- URL             : http://localhost/proj-kelola-uang/public/api/target/tambah
- Body JSON       : target_id, dompet_id, jumlah


=========================================================
6. FITUR DANA DARURAT
=========================================================

A. Status Dana Darurat
- Lokasi Frontend : Halaman Dana Darurat
- Kegunaan        : Menampilkan nominal target dan jumlah uang darurat yang sudah terkumpul.
- Method          : GET
- URL             : http://localhost/proj-kelola-uang/public/api/dana-darurat

B. Set Target Dana
- Lokasi Frontend : Halaman Dana Darurat (Pengaturan Target)
- Kegunaan        : Menetapkan atau mengubah nominal batas target dana darurat.
- Method          : POST
- URL             : http://localhost/proj-kelola-uang/public/api/dana-darurat
- Body JSON       : jumlah_target

C. Alokasi / Nabung Dana Darurat
- Lokasi Frontend : Halaman Dana Darurat (Tombol Isi Saldo)
- Kegunaan        : Memindahkan uang dari dompet ke wadah Dana Darurat. Saldo dompet OTOMATIS terpotong.
- Method          : PUT
- URL             : http://localhost/proj-kelola-uang/public/api/dana-darurat/tambah
- Body JSON       : dompet_id, jumlah


=========================================================
7. FITUR LAPORAN
=========================================================

A. Rangkuman Laporan Bulanan
- Lokasi Frontend : Halaman Laporan
- Kegunaan        : Menampilkan ringkasan total pemasukan, pengeluaran, tabungan, serta rincian lengkap setiap transaksinya berdasarkan bulan tertentu.
- Method          : GET
- URL             : http://localhost/proj-kelola-uang/public/api/laporan
- Query Opsional  : ?bulan=11&tahun=2023 (Jika kosong, tampilkan bulan saat ini)
