<?php
/**
 * Unified Entry Point
 * Menangani request API dan melayani Frontend React (SPA).
 */

require_once __DIR__ . '/../app/core/Env.php';
Env::load();

// Konfigurasi CORS - Lebih ketat di production
$allowed_origin = Env::get('ALLOWED_ORIGIN', '*');
header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight request dari browser
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$api_base = Env::get('API_BASE_PATH', '/proj-kelola-uang/api');

// 1. Jika request mengarah ke API
// Kita cek apakah URI dimulai dengan api_base 
// Khusus untuk php -S localhost secara internal, kita juga dukung langsung /api
if (str_starts_with($uri, $api_base) || (PHP_SAPI === 'cli-server' && str_starts_with($uri, '/api'))) {
    require_once __DIR__ . '/../routes/api.php';
    exit();
}

// 2. Jika request ke file fisik yang ada di folder public (js, css, images) 
if (file_exists(__DIR__ . $uri) && is_file(__DIR__ . $uri)) {
    return false; // Biarkan server melayani file tersebut
}

// 2.1 Cek folder frontend/dist untuk aset produksi (Production SPA support)
// Normalisasi path untuk mendukung Windows/Linux
$uri_path = ltrim($uri, '/');
$base_dist = realpath(dirname(__DIR__) . '/frontend/dist');

// Jika request meminta aset (biasanya di folder /assets/ hasil build Vite)
if (str_starts_with($uri, '/assets/')) {
    $requested_file = $base_dist . '/' . $uri_path;
    if (file_exists($requested_file) && is_file($requested_file)) {
        $ext = pathinfo($requested_file, PATHINFO_EXTENSION);
        $mimes = [
            'css'   => 'text/css',
            'js'    => 'application/javascript',
            'json'  => 'application/json',
            'png'   => 'image/png',
            'jpg'   => 'image/jpeg',
            'jpeg'  => 'image/jpeg',
            'svg'   => 'image/svg+xml',
            'woff'  => 'font/woff',
            'woff2' => 'font/woff2',
            'ttf'   => 'font/ttf',
            'ico'   => 'image/x-icon',
        ];
        header("Content-Type: " . ($mimes[$ext] ?? 'application/octet-stream'));
        readfile($requested_file);
        exit();
    }
}

// 3. Fallback: Sajikan index.html untuk semua route lainnya (React SPA)
$dist_index = dirname(__DIR__) . '/frontend/dist/index.html';
if (file_exists($dist_index)) {
    readfile($dist_index);
    exit();
}

// 4. Tambahan: Development Helper
// Jika di mode development dan file tidak ditemukan, berikan info yang jelas
if (Env::get('APP_ENV') === 'development' || Env::get('APP_DEBUG') === 'true') {
    http_response_code(200);
    echo "<div style='font-family: sans-serif; padding: 40px; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #333;'>";
    echo "<h1 style='color: #408A71;'>Uangmu - Aluran Backend</h1>";
    echo "<hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'>";
    echo "<p>Backend API berjalan di jalur <code>$api_base</code>.</p>";
    echo "<p style='background: #fdfdfd; padding: 15px; border-radius: 8px; border: 1px solid #eee;'>";
    echo "<strong>Status Frontend:</strong><br>";
    echo "File produksi tidak ditemukan (folder <code>dist</code> kosong).";
    echo "</p>";
    echo "<p>Langkah untuk melanjutkan pengembangan:</p>";
    echo "<ul>
            <li>Gunakan <code>npm run dev</code> di folder <code>frontend</code>.</li>
            <li>Akses melalui <a href='http://localhost:5173' style='color: #408A71; font-weight: bold;'>localhost:5173</a>.</li>
            <li>Backend API dapat dihubungi langsung di <a href='/api/transaksi' style='color: #408A71;'>/api/...</a></li>
          </ul>";
    echo "</div>";
    exit();
}

// Jika semua gagal
http_response_code(404);
echo "404 - Halaman tidak ditemukan atau aplikasi belum di-build.";