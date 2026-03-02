<?php

class UserLoginLogicController
{

    private $model;

    public function __construct($db)
    {
        $this->model = new UserModel($db);
    }

    public function process($data)
    {
        $user = $this->model->getUserByUsername($data['username']);

        if (!$user) {
            return [
                "status" => false,
                "error_code" => "INVALID_CREDENTIALS"
            ];
        }

        if (!password_verify($data['password'], $user['password'])) {
            return [
                "status" => false,
                "error_code" => "INVALID_CREDENTIALS"
            ];
        }

        // Set session variables
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];

        return [
            "status" => true,
            "data" => [
                "id" => $user['id'],
                "username" => $user['username']
            ]
        ];
    }
}
