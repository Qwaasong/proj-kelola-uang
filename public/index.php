<?php

/** 
 * BAGIAN 1: PERSIAPAN (IMPORT ALAT)
 * require_once artinya "Ambilkan saya berkas ini, saya butuh isinya untuk bekerja".
 * Baris ini mengambil pengaturan rahasia/konfigurasi dari folder 'app/core/Env.php'.
 */
require_once __DIR__ . '/../app/core/Env.php';

/**
 * BAGIAN 2: MENCARI TAHU SIAPA YANG DATANG
 * $_SERVER['REQUEST_URI'] = "Alamat apa yang diketik pengunjung di browser?"
 * $uri = Hasil bersihnya (contoh: /api/users atau /kontak).
 * $appEnv = Cek status aplikasi, apakah sedang tahap 'development' (pengembangan) atau 'production' (produksi).
 */
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$appEnv = Env::get('APP_ENV', 'development');

/**
 * BAGIAN 3: JALUR KHUSUS DATA (API)
 * Ibarat pengunjung bilang "Saya mau ambil data", bukan mau lihat gambar/tampilan.
 * Jika alamat yang diketik diawali dengan kata '/api/'.
 */
if (strpos($uri, '/api/') === 0) {
    // Ambilkan buku menu rute API di folder 'routes/api.php'
    require_once __DIR__ . '/../routes/api.php';
    // 'exit' artinya tugas selesai di sini, jangan lanjut ke bawah lagi.
    exit;
}

/**
 * BAGIAN 4: JALUR TAMPILAN JADI (MODE PRODUKSI)
 * Hanya aktif jika aplikasi sudah diset sebagai 'production' (sudah jadi).
 */
if ($appEnv === 'production') {
    // Tentukan di mana folder tempat menyimpan tampilan (frontend/dist).
    $frontendDist = __DIR__ . '/../frontend/dist';
    $filePath = $frontendDist . $uri;

    // A. Cek apakah pengunjung minta file nyata (seperti gambar, file CSS, atau JS).
    if ($uri !== '/' && file_exists($filePath) && is_file($filePath)) {
        
        // Cari tahu jenis filenya (apakah gambar? apakah tulisan?) agar browser tidak bingung.
        $ext = pathinfo($filePath, PATHINFO_EXTENSION);
        $mimes = [
            'css'  => 'text/css',
            'js'   => 'application/javascript',
            'svg'  => 'image/svg+xml',
            'png'  => 'image/png',
            'jpg'  => 'image/jpeg',
            'json' => 'application/json',
        ];
        
        // Beritahu browser: "Hey, ini file CSS lho" atau "Ini file Gambar".
        if (isset($mimes[$ext])) {
            header("Content-Type: " . $mimes[$ext]);
        }
        
        // Kirimkan isi filenya ke layar pengunjung.
        readfile($filePath);
        exit;
    }

    // B. Jika yang dicari tidak ketemu, kasih halaman utama (index.html) milik frontend.
    if (file_exists($frontendDist . '/index.html')) {
        readfile($frontendDist . '/index.html');
        exit;
    }
}

/**
 * BAGIAN 5: JALUR DARURAT (MODE PENGEMBANGAN)
 * Jika kode sampai ke sini, berarti file tidak ketemu (404) atau kita masih dalam tahap coding.
 * PHP akan berhenti mengirim data dan mulai menampilkan kode HTML (tampilan visual) di bawah ini.
 */
http_response_code(404);
?>

<!-- DI BAWAH INI ADALAH TAMPILAN VISUAL (HTML) SAAT ANDA SEDANG CODING -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Mode Pengembangan - PHP API</title>
    <!-- CSS di bawah untuk mengatur agar kotak info tampil di tengah-tengah layar dan rapi -->
    <style>
        body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f4f7f6; color: #333; text-align: center; }
        .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 500px; }
        code { background: #eee; padding: 0.2rem 0.4rem; border-radius: 4px; }
        .badge { background: #3498db; color: white; padding: 0.3rem 0.6rem; border-radius: 20px; font-size: 0.8rem; }
    </style>
</head>
<body>
    <div class="card">
        <!-- Menampilkan status apakah 'development' atau 'production' secara otomatis -->
        <h1>Mode Pengembangan <span class="badge"><?= $appEnv ?></span></h1>
        <p>Anda sedang mengakses Backend PHP secara langsung.</p>
        <p>Untuk melihat tampilan aplikasi (Frontend), silakan gunakan alamat Vite:</p>
        <!-- Link untuk membuka server frontend yang biasanya berjalan saat coding -->
        <p><a href="http://localhost:5173" style="color: #3498db; font-weight: bold; text-decoration: none;">http://localhost:5173</a></p>
        <hr>
        <p style="font-size: 0.9rem; color: #666;">Jika Anda ingin melihat versi produksi, ubah <code>APP_ENV=production</code> di file <code>.env</code> dan pastikan Anda sudah menjalankan <code>npm run build</code>.</p>
    </div>
</body>
</html>
