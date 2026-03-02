<?php

class UserLoginValidationController
{

    public function validate($data)
    {

        $allowedFields = ['username', 'password'];

        if (count($data) > count($allowedFields)) {
            return $this->fail("TOO_MANY_FIELDS");
        }

        foreach ($data as $key => $value) {
            if (!in_array($key, $allowedFields)) {
                return $this->fail("UNKNOWN_FIELD", $key);
            }
        }

        if (empty($data['username'])) {
            return $this->fail("REQUIRED", "username");
        }

        if (empty($data['password'])) {
            return $this->fail("REQUIRED", "password");
        }

        return ["status" => true];
    }

    private function fail($code, $field = null, $value = null)
    {
        return [
            "status" => false,
            "error_code" => $code,
            "field" => $field,
            "value" => $value
        ];
    }
}
