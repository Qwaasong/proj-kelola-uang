<?php

class UserMessage
{

    private static $messages = [

        "CREATED" => "User berhasil dibuat",
        "UPDATED" => "User berhasil diperbarui",
        "DELETED" => "User berhasil dihapus",
        "FOUND" => "User ditemukan"
    ];

    public static function get($key)
    {
        return self::$messages[$key] ?? "User message tidak ditemukan";
    }
}
