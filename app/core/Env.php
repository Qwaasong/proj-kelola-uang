<?php

/**
 * Utility class untuk membaca file .env
 * Cara pakai: Env::get('DB_HOST')
 */
class Env
{
    private static bool $loaded = false;

    /**
     * Muat file .env ke dalam environment PHP.
     * Dipanggil otomatis saat pertama kali Env::get() digunakan.
     */
    public static function load(?string $path = null): void
    {
        if (self::$loaded) {
            return;
        }

        // Default: cari .env di root project (2 level di atas folder core/)
        $envPath = $path ?? dirname(__DIR__, 2) . '/.env';

        if (!file_exists($envPath)) {
            return;
        }

        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach ($lines as $line) {
            // Abaikan baris komentar
            if (str_starts_with(trim($line), '#')) {
                continue;
            }

            [$key, $value] = explode('=', $line, 2) + [1 => ''];
            $key   = trim($key);
            $value = trim($value);

            // Hapus kutip jika ada, misal: DB_PASS="secret"
            $value = trim($value, '"\'');

            if (!empty($key)) {
                $_ENV[$key]    = $value;
                $_SERVER[$key] = $value;
                putenv("$key=$value");
            }
        }

        self::$loaded = true;
    }

    /**
     * Ambil nilai dari variabel environment.
     * 
     * @param  string $key     Nama variabel (misal: 'DB_HOST')
     * @param  mixed  $default Nilai default jika tidak ditemukan
     * @return mixed
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        self::load();

        return $_ENV[$key] ?? getenv($key) ?: $default;
    }
}
