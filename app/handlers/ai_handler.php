<?php
use App\Config\Database;

require_once '../app/config/database.php';
require_once '../app/core/Response.php';
require_once '../app/core/Env.php';
require_once '../app/models/ReportModel.php';

// Ambil input JSON
$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? null;
$question = $data['question'] ?? "Berikan analisis singkat tentang kondisi keuanganku saat ini.";

if (!$user_id) {
    Response::error(400, "User ID tidak ditemukan. Pastikan Anda sudah login.");
    exit;
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $reportModel = new ReportModel($db);

    // 1. Ambil 15 transaksi terakhir sebagai konteks untuk AI
    $history = $reportModel->getFilteredTransactions($user_id, ['limit' => 15]);
    $contextData = json_encode($history);

    // 2. Ambil API Key dari .env
    $apiKey = Env::get('GEMINI_API_KEY');
    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

    // 3. Susun Prompt (Instruksi untuk AI)
    $prompt = "Kamu adalah pakar keuangan pribadi profesional. 
               Berikut adalah data transaksi user dalam format JSON: $contextData. 
               Pertanyaan User: '$question'. 
               Berikan jawaban yang sangat ramah, singkat, padat, dan berikan saran finansial yang konkret.";

    $payload = [
        "contents" => [
            ["parts" => [["text" => $prompt]]]
        ]
    ];

    // 4. Kirim request ke Google Gemini API menggunakan cURL
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        Response::error($httpCode, "Gagal terhubung ke layanan AI. Pastikan API Key benar.");
        exit;
    }

    $responseArray = json_decode($result, true);
    $answer = $responseArray['candidates'][0]['content']['parts'][0]['text'] ?? "AI sedang berpikir terlalu keras, coba tanya lagi nanti.";

    Response::success(200, "Analisis AI Berhasil", ["answer" => $answer]);

} catch (Exception $e) {
    Response::error(500, "Terjadi kesalahan sistem AI: " . $e->getMessage());
}
