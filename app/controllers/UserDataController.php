<?php

class UserDataController
{

    private $model;

    public function __construct($db)
    {
        $this->model = new UserModel($db);
    }

    public function store($data)
    {

        $saved = $this->model->save($data);

        if (!$saved) {
            return ["status" => false];
        }

        return ["status" => true];
    }
}
