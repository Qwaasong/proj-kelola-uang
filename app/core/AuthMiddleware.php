<?php

require_once __DIR__ . '/JwtHelper.php';
require_once __DIR__ . '/Response.php';

class AuthMiddleware
{
    /**
     * Fungsi ini akan dipanggil di setiap rute yang butuh login.
     * Jika gagal, akan langsung mengembalikan JSON error dan menghentikan script.
     * Jika berhasil, akan mengembalikan data user (id, username).
     */
    public static function authenticate()
    {
        // 1. Ambil semua Header yang dikirim oleh Frontend
        $headers = apache_request_headers();
        
        // Terkadang server membaca 'Authorization' huruf kecil, jadi kita amankan
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : '');

        // 2. Cek apakah Header Authorization ada dan menggunakan format 'Bearer <token>'
        if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            Response::error("Akses ditolak. Token tidak ditemukan atau format salah.", 401);
        }

        // 3. Ekstrak token dari teks 'Bearer ...'
        $token = $matches[1];

        // 4. Validasi token menggunakan JwtHelper
        $userData = JwtHelper::validateToken($token);

        if (!$userData) {
            Response::error("Sesi telah berakhir atau token tidak valid. Silakan login kembali.", 401);
        }

        // 5. Kembalikan data user agar bisa digunakan oleh file Handler
        return $userData;
    }
}

// Fallback: Jika function apache_request_headers() tidak tersedia di server (misal pakai Nginx)
if (!function_exists('apache_request_headers')) {
    function apache_request_headers() {
        $arh = array();
        $rx_http = '/\AHTTP_/';
        foreach($_SERVER as $key => $val) {
            if( preg_match($rx_http, $key) ) {
                $arh_key = preg_replace($rx_http, '', $key);
                $rx_matches = array();
                $rx_matches = explode('_', $arh_key);
                if( count($rx_matches) > 0 and strlen($arh_key) > 2 ) {
                    foreach($rx_matches as $ak_key => $ak_val) $rx_matches[$ak_key] = ucfirst(strtolower($ak_val));
                    $arh_key = implode('-', $rx_matches);
                }
                $arh[$arh_key] = $val;
            }
        }
        return( $arh );
    }
}
