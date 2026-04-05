<?php

class JwtHelper {
    
    // Encode Base64URL (format aman untuk URL/Header)
    private static function base64url_encode($data) {
        $b64 = base64_encode($data);
        if ($b64 === false) return false;
        $url = strtr($b64, '+/', '-_');
        return rtrim($url, '=');
    }

    // Decode Base64URL
    private static function base64url_decode($data) {
        $b64 = strtr($data, '-_', '+/');
        return base64_decode($b64, true);
    }

    // Membuat Token JWT
    public static function generateToken($payload_data) {
        $secret = getenv('JWT_SECRET') ?: 'default_secret_key';
        
        // Header standar JWT
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        
        // Payload (Data User + Expiration Time)
        // Set token kadaluarsa dalam 24 jam
        $payload_data['exp'] = time() + (24 * 60 * 60); 
        $payload = json_encode($payload_data);

        // Encode Header & Payload
        $base64UrlHeader = self::base64url_encode($header);
        $base64UrlPayload = self::base64url_encode($payload);

        // Buat Signature
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = self::base64url_encode($signature);

        // Gabungkan jadi JWT Utuh
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    // Validasi dan Ekstrak Token JWT
    public static function validateToken($token) {
        $secret = getenv('JWT_SECRET') ?: 'default_secret_key';
        
        $tokenParts = explode('.', $token);
        if (count($tokenParts) != 3) return false;

        $header = $tokenParts[0];
        $payload = $tokenParts[1];
        $signature_provided = $tokenParts[2];

        // Buat ulang signature untuk dicocokkan
        $signature_expected = hash_hmac('sha256', $header . "." . $payload, $secret, true);
        $base64UrlSignatureExpected = self::base64url_encode($signature_expected);

        // Jika signature cocok
        if (hash_equals($base64UrlSignatureExpected, $signature_provided)) {
            $payload_data = json_decode(self::base64url_decode($payload), true);
            
            // Cek apakah token sudah expired
            if (isset($payload_data['exp']) && $payload_data['exp'] < time()) {
                return false; // Expired
            }
            return $payload_data; // Mengembalikan data user yang di-encode
        }
        return false;
    }

    // Fungsi otomatis untuk mengecek Header Authorization
    public static function getAuthorizedUser() {
        $authHeader = null;

        // Mencoba berbagai cara mendapatkan header Authorization (mendukung PHP-FPM, Apache, Nginx, dan php -S)
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        } elseif (function_exists('getallheaders')) {
            $headers = getallheaders();
            // Cek Case-Insensitive untuk key 'Authorization'
            foreach ($headers as $key => $value) {
                if (strtolower($key) === 'authorization') {
                    $authHeader = $value;
                    break;
                }
            }
        } elseif (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            if (isset($headers['Authorization'])) {
                $authHeader = $headers['Authorization'];
            }
        }

        if ($authHeader) {
            // Pisahkan kata "Bearer " dari token
            $parts = explode(" ", $authHeader);
            if(count($parts) == 2 && (strtolower($parts[0]) === "bearer")) {
                $token = $parts[1];
                return self::validateToken($token);
            }
        }
        return false;
    }
}