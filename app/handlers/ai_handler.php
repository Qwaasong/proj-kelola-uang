<?php
use App\Config\Database;
require_once '../app/config/database.php';
require_once '../app/core/Response.php';
require_once '../app/core/Env.php';
require_once '../app/models/ReportModel.php';

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? null;
$question = $data['question'] ?? "Berikan analisis singkat keuanganku.";

if (!$user_id) { Response::error(400, "User ID wajib ada."); exit; }

$database = new Database();
$db = $database->getConnection();
$reportModel = new ReportModel($db);

// 1. Ambil data transaksi terakhir sebagai konteks untuk AI
$history = $reportModel->getFilteredTransactions($user_id, ['limit' => 10]);
$context = json_encode($history);

// 2. Setting API Gemini
$apiKey = Env::get('GEMINI_API_KEY');
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

$payload = [
    "contents" => [["parts" => [["text" => "Kamu adalah asisten keuangan. Berikut data transaksi user: $context. Pertanyaan user: $question"]]]]
];

// 3. Kirim ke Google menggunakan cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$result = curl_exec($ch);
curl_close($ch);

$response = json_decode($result, true);
$answer = $response['candidates'][0]['content']['parts'][0]['text'] ?? "AI sedang sibuk, coba lagi nanti.";

Response::success(200, "Analisis berhasil", ["answer" => $answer]);