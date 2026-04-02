<?php

class JwtHelper
{
    // Kunci rahasia untuk mengamankan token. (Sebaiknya letakkan di .env nantinya)
    private static $secret_key = "RAHASIA_NEGARA_UANGMU_APP_123!@#";

    public static function generateToken($payload)
    {
        // Header
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));

        // Tambahkan waktu kedaluwarsa (misal: 24 jam)
        $payload['exp'] = time() + (24 * 60 * 60); 
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($payload)));

        // Signature (Tanda Tangan)
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$secret_key, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public static function validateToken($token)
    {
        $tokenParts = explode('.', $token);
        if (count($tokenParts) != 3) {
            return false;
        }

        $header = $tokenParts[0];
        $payload = $tokenParts[1];
        $signature_provided = $tokenParts[2];

        // Cek apakah token dipalsukan
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(hash_hmac('sha256', $header . "." . $payload, self::$secret_key, true)));
        
        if ($base64UrlSignature !== $signature_provided) {
            return false; // Token tidak valid / diubah
        }

        // Cek apakah token expired
        $payload_data = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload)), true);
        if (isset($payload_data['exp']) && $payload_data['exp'] < time()) {
            return false; // Token kadaluarsa
        }

        return $payload_data; // Kembalikan data user jika valid
    }
}
