<?php

/**
 * ============================================
 *  FULL API TEST SCRIPT - Kelola Uang API
 *  Covers ALL endpoints in routes/api.php
 *  Run: php test_api.php
 * ============================================
 *
 * ENDPOINTS TESTED:
 *  [AUTH]        POST /api/otentikasi/daftar
 *  [AUTH]        POST /api/otentikasi/masuk
 *  [DASHBOARD]   GET  /api/dashboard
 *  [DOMPET]      POST /api/dompet
 *  [DOMPET]      GET  /api/dompet
 *  [DOMPET]      PUT  /api/dompet/transfer
 *  [DOMPET]      DELETE /api/dompet
 *  [KATEGORI]    GET  /api/kategori
 *  [TRANSAKSI]   POST /api/transaksi
 *  [TRANSAKSI]   GET  /api/transaksi
 *  [TRANSAKSI]   PUT  /api/transaksi
 *  [TRANSAKSI]   DELETE /api/transaksi
 *  [DANA DARURAT] POST /api/dana-darurat
 *  [DANA DARURAT] GET  /api/dana-darurat
 *  [DANA DARURAT] PUT  /api/dana-darurat/tambah
 *  [TARGET]      POST /api/target
 *  [TARGET]      GET  /api/target
 *  [TARGET]      PUT  /api/target/tambah
 *  [TARGET]      DELETE /api/target
 *  [LAPORAN]     GET  /api/laporan
 */

$baseUrl    = "http://localhost:80";
$testUser   = "tester_" . bin2hex(random_bytes(4));
$testPass   = "password123";
$token      = "";
$passed     = 0;
$failed     = 0;
$dompetId   = null;
$dompet2Id  = null;
$transId    = null;
$targetId   = null;

// ==========================================
// HELPERS
// ==========================================

function request($method, $path, $data = null, $token = null) {
    global $baseUrl;
    $url = $baseUrl . $path;
    $ch = curl_init($url);
    $headers = ['Content-Type: application/json'];
    if ($token) $headers[] = "Authorization: Bearer $token";
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    if ($data) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if (curl_errno($ch)) echo "   [CURL ERROR] " . curl_error($ch) . "\n";
    curl_close($ch);
    return ['code' => $httpCode, 'data' => json_decode($response, true), 'raw' => $response];
}

function test($label, $response, $expectedCode, &$passed, &$failed, $successCallback = null) {
    $status = ($response['code'] === $expectedCode) ? "✓ PASS" : "✗ FAIL";
    if ($response['code'] === $expectedCode) {
        $passed++;
        echo "   $status | $label\n";
        if ($successCallback) $successCallback($response);
    } else {
        $failed++;
        $msg = isset($response['data']['data']) ? $response['data']['data'] : $response['raw'];
        echo "   $status | $label\n";
        echo "          Expected HTTP $expectedCode, got HTTP {$response['code']}\n";
        echo "          Response: $msg\n";
    }
}

function section($title) {
    echo "\n" . str_repeat("=", 50) . "\n";
    echo "  $title\n";
    echo str_repeat("=", 50) . "\n";
}

// ==========================================
// START TESTS
// ==========================================

echo "\n";
echo "╔══════════════════════════════════════════╗\n";
echo "║    KELOLA UANG - FULL API TEST SUITE     ║\n";
echo "╚══════════════════════════════════════════╝\n";
echo "  User: $testUser\n";
echo "  Base URL: $baseUrl\n";

// ==========================================
// [1] OTENTIKASI
// ==========================================
section("[1] OTENTIKASI");

// Register
$res = request('POST', '/otentikasi/daftar', [
    'username' => $testUser, 'password' => $testPass, 'confirm_password' => $testPass
]);
test("POST /otentikasi/daftar (Register)", $res, 201, $passed, $failed);

// Register with existing username (should fail)
$res2 = request('POST', '/otentikasi/daftar', [
    'username' => $testUser, 'password' => $testPass, 'confirm_password' => $testPass
]);
test("POST /otentikasi/daftar (Duplicate user → 400)", $res2, 400, $passed, $failed);

// Register with mismatched password (should fail)
$res3 = request('POST', '/otentikasi/daftar', [
    'username' => "x_$testUser", 'password' => "abc", 'confirm_password' => "xyz"
]);
test("POST /otentikasi/daftar (Password mismatch → 400)", $res3, 400, $passed, $failed);

// Login
$res = request('POST', '/otentikasi/masuk', ['username' => $testUser, 'password' => $testPass]);
test("POST /otentikasi/masuk (Login)", $res, 200, $passed, $failed, function($r) use (&$token) {
    $token = $r['data']['data']['token'];
});
if (empty($token)) {
    echo "\n[FATAL] Token not obtained. Cannot continue protected tests.\n";
    exit(1);
}

// Login with wrong password (should fail)
$res = request('POST', '/otentikasi/masuk', ['username' => $testUser, 'password' => 'wrongpass']);
test("POST /otentikasi/masuk (Wrong password → 401)", $res, 401, $passed, $failed);

// ==========================================
// [2] DASHBOARD
// ==========================================
section("[2] DASHBOARD");

$res = request('GET', '/dashboard', null, $token);
test("GET /dashboard (With Token)", $res, 200, $passed, $failed);

$res = request('GET', '/dashboard');
test("GET /dashboard (Without Token → 401)", $res, 401, $passed, $failed);

// ==========================================
// [3] DOMPET
// ==========================================
section("[3] DOMPET");

// Create Wallet 1
$res = request('POST', '/dompet', ['nama_dompet' => 'Dompet Utama', 'saldo' => 2000000], $token);
test("POST /dompet (Create Wallet 1)", $res, 201, $passed, $failed);

// Create Wallet 2
$res = request('POST', '/dompet', ['nama_dompet' => 'Dompet Cadangan', 'saldo' => 500000], $token);
test("POST /dompet (Create Wallet 2)", $res, 201, $passed, $failed);

// Get All Wallets
$res = request('GET', '/dompet', null, $token);
test("GET /dompet (Get All Wallets)", $res, 200, $passed, $failed, function($r) use (&$dompetId, &$dompet2Id) {
    $wallets = $r['data']['data'] ?? [];
    if (is_array($wallets) && count($wallets) >= 2) {
        // Find by name
        foreach ($wallets as $w) {
            if ($w['nama_dompet'] === 'Dompet Utama') $dompetId = $w['id'];
            if ($w['nama_dompet'] === 'Dompet Cadangan') $dompet2Id = $w['id'];
        }
    } elseif (is_array($wallets) && count($wallets) >= 1) {
        $dompetId = $wallets[0]['id'];
    }
});

// Transfer between wallets
if ($dompetId && $dompet2Id) {
    $res = request('PUT', '/dompet/transfer', ['dari_dompet_id' => $dompetId, 'ke_dompet_id' => $dompet2Id, 'jumlah' => 100000], $token);
    test("PUT /dompet/transfer (Transfer Rp 100.000)", $res, 200, $passed, $failed);

    $res = request('PUT', '/dompet/transfer', ['dari_dompet_id' => $dompetId, 'ke_dompet_id' => $dompet2Id, 'jumlah' => 99999999], $token);
    test("PUT /dompet/transfer (Insufficient balance → 400)", $res, 400, $passed, $failed);
} else {
    echo "   ⚠ SKIP | PUT /dompet/transfer (Wallet IDs not found)\n";
}

// Delete Wallet 2
if ($dompet2Id) {
    $res = request('DELETE', "/dompet?id=$dompet2Id", null, $token);
    test("DELETE /dompet (Delete Cadangan Wallet)", $res, 200, $passed, $failed);
}

// Delete without ID (should fail)
$res = request('DELETE', "/dompet", null, $token);
test("DELETE /dompet (No ID → 400)", $res, 400, $passed, $failed);

// ==========================================
// [4] KATEGORI
// ==========================================
section("[4] KATEGORI");

$res = request('GET', '/kategori');
test("GET /kategori (Public - No Token Needed)", $res, 200, $passed, $failed);

// ==========================================
// [5] TRANSAKSI
// ==========================================
section("[5] TRANSAKSI");

// Add Transaction (Pemasukan)
$res = request('POST', '/transaksi', [
    'nama_transaksi' => 'Gaji Bulan Ini', 'jenis' => 'Pemasukan',
    'jumlah' => 5000000, 'tanggal' => date('Y-m-d'), 'dompet_id' => $dompetId
], $token);
test("POST /transaksi (Add Pemasukan)", $res, 201, $passed, $failed);

// Add Transaction (Pengeluaran)
$res = request('POST', '/transaksi', [
    'nama_transaksi' => 'Makan Siang', 'jenis' => 'Pengeluaran',
    'jumlah' => 50000, 'tanggal' => date('Y-m-d'), 'dompet_id' => $dompetId
], $token);
test("POST /transaksi (Add Pengeluaran)", $res, 201, $passed, $failed);

// Add Transaction (Incomplete data, should fail)
$res = request('POST', '/transaksi', ['nama_transaksi' => 'Test'], $token);
test("POST /transaksi (Incomplete data → 400)", $res, 400, $passed, $failed);

// Get All Transactions
$res = request('GET', '/transaksi', null, $token);
test("GET /transaksi (Get All)", $res, 200, $passed, $failed, function($r) use (&$transId) {
    if (isset($r['data']['data']['data'][0])) {
        $transId = $r['data']['data']['data'][0]['id'];
    }
});

// Get with pagination
$res = request('GET', '/transaksi?page=1&limit=5', null, $token);
test("GET /transaksi (Paginated page=1&limit=5)", $res, 200, $passed, $failed);

// Get with search
$res = request('GET', '/transaksi?search=Makan', null, $token);
test("GET /transaksi (Search 'Makan')", $res, 200, $passed, $failed);

// Update a transaction
if ($transId) {
    $res = request('PUT', '/transaksi', [
        'id' => $transId, 'nama_transaksi' => 'Gaji (Updated)', 'jenis' => 'Pemasukan',
        'jumlah' => 5500000, 'tanggal' => date('Y-m-d'), 'dompet_id' => $dompetId
    ], $token);
    test("PUT /transaksi (Update Transaction)", $res, 200, $passed, $failed);
}

// Delete Transaction
if ($transId) {
    $res = request('DELETE', "/transaksi?id=$transId", null, $token);
    test("DELETE /transaksi (Delete & Reverse Balance)", $res, 200, $passed, $failed);
}

// Delete non-existent transaction
$res = request('DELETE', "/transaksi?id=999999", null, $token);
test("DELETE /transaksi (Non-existent ID → 500)", $res, 500, $passed, $failed);

// Delete without ID
$res = request('DELETE', "/transaksi", null, $token);
test("DELETE /transaksi (No ID → 400)", $res, 400, $passed, $failed);

// ==========================================
// [6] DANA DARURAT
// ==========================================
section("[6] DANA DARURAT");

// Set Target Dana Darurat
$res = request('POST', '/dana-darurat', ['jumlah_target' => 10000000], $token);
test("POST /dana-darurat (Set Emergency Fund Target)", $res, 200, $passed, $failed);

// Get Dana Darurat
$res = request('GET', '/dana-darurat', null, $token);
test("GET /dana-darurat (Get Status)", $res, 200, $passed, $failed);

// Add Dana to Dana Darurat
if ($dompetId) {
    $res = request('PUT', '/dana-darurat/tambah', ['dompet_id' => $dompetId, 'jumlah' => 200000], $token);
    test("PUT /dana-darurat/tambah (Add Rp 200.000)", $res, 200, $passed, $failed);

    // Insufficient balance
    $res = request('PUT', '/dana-darurat/tambah', ['dompet_id' => $dompetId, 'jumlah' => 99999999], $token);
    test("PUT /dana-darurat/tambah (Insufficient → 400)", $res, 400, $passed, $failed);
}

// ==========================================
// [7] TARGET FINANSIAL
// ==========================================
section("[7] TARGET FINANSIAL");

// Create Target
$res = request('POST', '/target', ['nama_target' => 'Beli Laptop', 'jumlah_target' => 15000000, 'tanggal_tercapai' => '2026-12-31'], $token);
test("POST /target (Create Goal)", $res, 201, $passed, $failed);

// Create Target (Incomplete)
$res = request('POST', '/target', ['nama_target' => 'Incomplete'], $token);
test("POST /target (Incomplete data → 400)", $res, 400, $passed, $failed);

// Get All Targets
$res = request('GET', '/target', null, $token);
test("GET /target (Get All Goals)", $res, 200, $passed, $failed, function($r) use (&$targetId) {
    if (isset($r['data']['data'][0])) {
        $targetId = $r['data']['data'][0]['id'];
    }
});

// Add Dana to Target
if ($targetId && $dompetId) {
    $res = request('PUT', '/target/tambah', ['target_id' => $targetId, 'dompet_id' => $dompetId, 'jumlah' => 500000], $token);
    test("PUT /target/tambah (Add Rp 500.000 to Goal)", $res, 200, $passed, $failed);
}

// Delete Target
if ($targetId) {
    $res = request('DELETE', "/target?id=$targetId", null, $token);
    test("DELETE /target (Delete Goal)", $res, 200, $passed, $failed);
}

// Delete without ID
$res = request('DELETE', "/target", null, $token);
test("DELETE /target (No ID → 400)", $res, 400, $passed, $failed);

// ==========================================
// [8] LAPORAN
// ==========================================
section("[8] LAPORAN");

$res = request('GET', '/laporan', null, $token);
test("GET /laporan (Current Month Report)", $res, 200, $passed, $failed);

$res = request('GET', '/laporan?bulan=01&tahun=2026', null, $token);
test("GET /laporan (Custom Month: Jan 2026)", $res, 200, $passed, $failed);

$res = request('GET', '/laporan');
test("GET /laporan (Without Token → 401)", $res, 401, $passed, $failed);

// ==========================================
// RESULTS
// ==========================================

$total = $passed + $failed;
echo "\n";
echo "╔══════════════════════════════════════════╗\n";
echo "║              TEST RESULTS               ║\n";
echo "╠══════════════════════════════════════════╣\n";
printf("║  ✓ PASSED  : %-3d / %-3d                  ║\n", $passed, $total);
printf("║  ✗ FAILED  : %-3d / %-3d                  ║\n", $failed, $total);
echo "╚══════════════════════════════════════════╝\n\n";

exit($failed > 0 ? 1 : 0);
