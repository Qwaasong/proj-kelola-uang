<?php

class UserValidationController
{

    public function validate($data)
    {

        $allowedFields = ['username', 'password', 'confirm_password'];

        if (count($data) > count($allowedFields)) {
            return $this->fail("TOO_MANY_FIELDS");
        }

        foreach ($data as $key => $value) {
            if (!in_array($key, $allowedFields)) {
                return $this->fail("UNKNOWN_FIELD", $key);
            }
        }

        $rules = [
            "username" => "required|string|min:3|max:50",
            "password" => "required|string|min:6|max:255",
            "confirm_password" => "required|string"
        ];

        foreach ($rules as $field => $ruleString) {

            $ruleList = explode('|', $ruleString);

            foreach ($ruleList as $rule) {

                if ($rule === "required" && empty($data[$field])) {
                    return $this->fail("REQUIRED", $field);
                }

                if ($rule === "string" && !is_string($data[$field])) {
                    return $this->fail("STRING", $field);
                }

                if (str_starts_with($rule, "min:")) {
                    $min = explode(':', $rule)[1];
                    if (strlen($data[$field]) < $min) {
                        return $this->fail("MIN", $field, $min);
                    }
                }

                if (str_starts_with($rule, "max:")) {
                    $max = explode(':', $rule)[1];
                    if (strlen($data[$field]) > $max) {
                        return $this->fail("MAX", $field, $max);
                    }
                }
            }
        }

        if ($data['password'] !== $data['confirm_password']) {
            return $this->fail("PASSWORD_MISMATCH");
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
