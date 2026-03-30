<?php

require_once __DIR__ . '/../app/core/Env.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$appEnv = Env::get('APP_ENV', 'development');

// 1. Jika request ke API
if (strpos($uri, '/api/') === 0) {
    require_once __DIR__ . '/../routes/api.php';
    exit;
}

// 2. Jika bukan API dan dalam mode Produksi, layani folder dist
if ($appEnv === 'production') {
    $frontendDist = __DIR__ . '/../frontend/dist';
    $filePath = $frontendDist . $uri;

    if ($uri !== '/' && file_exists($filePath) && is_file($filePath)) {
        $ext = pathinfo($filePath, PATHINFO_EXTENSION);
        $mimes = [
            'css'  => 'text/css',
            'js'   => 'application/javascript',
            'svg'  => 'image/svg+xml',
            'png'  => 'image/png',
            'jpg'  => 'image/jpeg',
            'json' => 'application/json',
        ];
        if (isset($mimes[$ext])) {
            header("Content-Type: " . $mimes[$ext]);
        }
        readfile($filePath);
        exit;
    }

    if (file_exists($frontendDist . '/index.html')) {
        readfile($frontendDist . '/index.html');
        exit;
    }
}

// 3. Fallback untuk Mode Pengembangan (atau Produksi jika belum di-build)
http_response_code(404);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Mode Pengembangan - PHP API</title>
    <style>
        body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f4f7f6; color: #333; text-align: center; }
        .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 500px; }
        code { background: #eee; padding: 0.2rem 0.4rem; border-radius: 4px; }
        .badge { background: #3498db; color: white; padding: 0.3rem 0.6rem; border-radius: 20px; font-size: 0.8rem; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Mode Pengembangan <span class="badge"><?= $appEnv ?></span></h1>
        <p>Anda sedang mengakses Backend PHP secara langsung.</p>
        <p>Untuk melihat tampilan aplikasi (Frontend), silakan gunakan alamat Vite:</p>
        <p><a href="http://localhost:5173" style="color: #3498db; font-weight: bold; text-decoration: none;">http://localhost:5173</a></p>
        <hr>
        <p style="font-size: 0.9rem; color: #666;">Jika Anda ingin melihat versi produksi, ubah <code>APP_ENV=production</code> di file <code>.env</code> dan pastikan Anda sudah menjalankan <code>npm run build</code>.</p>
    </div>
</body>
</html>
