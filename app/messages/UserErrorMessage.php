<?php

class UserErrorMessage
{

    private static $messages = [

        "REQUIRED" => ":field wajib diisi",
        "STRING" => ":field harus berupa string",
        "MIN" => ":field minimal :value karakter",
        "MAX" => ":field maksimal :value karakter",
        "UNKNOWN_FIELD" => "Field :field tidak diperbolehkan",
        "TOO_MANY_FIELDS" => "Field yang dikirim terlalu banyak",
        "USERNAME_EXISTS" => "Username sudah terdaftar",
        "PASSWORD_MISMATCH" => "Password dan konfirmasi password tidak cocok",
        "INVALID_CREDENTIALS" => "Username atau password salah!"
    ];

    public static function get($code, $field = null, $value = null)
    {

        $message = self::$messages[$code] ?? "Error tidak dikenal";

        if ($field) {
            $message = str_replace(":field", $field, $message);
        }

        if ($value) {
            $message = str_replace(":value", $value, $message);
        }

        return $message;
    }
}
