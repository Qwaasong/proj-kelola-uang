<?php

class UserLogicController
{

    private $model;

    public function __construct($db)
    {
        $this->model = new UserModel($db);
    }

    public function process($data)
    {

        if ($this->model->usernameExists($data['username'])) {
            return [
                "status" => false,
                "error_code" => "USERNAME_EXISTS"
            ];
        }

        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);

        // Hapus confirm_password sebelum di-pass ke data controller karena tidak perlu disimpan
        unset($data['confirm_password']);

        return [
            "status" => true,
            "data" => $data
        ];
    }
}
