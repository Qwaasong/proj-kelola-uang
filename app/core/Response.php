<?php

class Response
{

    public static function success($message, $data = null, $code = 200)
    {
        http_response_code($code);
        header("Content-Type: application/json");

        echo json_encode([
            "status" => true,
            "message" => $message,
            "data" => $data
        ]);
        exit;
    }

    public static function error($message, $code = 400, $data = null)
    {
        http_response_code($code);
        header("Content-Type: application/json");

        echo json_encode([
            "status" => false,
            "message" => $message,
            "data" => $data
        ]);
        exit;
    }
}
