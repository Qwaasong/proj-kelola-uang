<?php

class Response {
    /**
     * Mengembalikan response dalam bentuk JSON
     * * @param int $statusCode (contoh: 200, 400, 404, 500)
     * @param string $status (contoh: "success", "error")
     * @param mixed $data (Pesan teks, array, atau object yang ingin dikirim)
     */
    public static function json($statusCode, $status, $data = null) {
        // Set HTTP status code
        http_response_code($statusCode);
        
        // Set header agar dikenali sebagai JSON
        header('Content-Type: application/json');
        
        // Format response standard
        $response = [
            'status' => $statusCode,
            'message' => $status,
            'data' => $data
        ];
        
        // Cetak JSON dan hentikan eksekusi script selanjutnya
        echo json_encode($response);
        exit();
    }
}