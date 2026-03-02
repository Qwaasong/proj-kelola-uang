

---

# 📁 STRUKTUR FINAL DARI AWAL

```bash
/project
│
├── config/
│   └── database.php
│
├── core/
│   └── Response.php
│
├── models/
│   └── UserModel.php
│
├── messages/
│   ├── UserMessage.php
│   └── UserErrorMessage.php
│
├── controllers/
│   ├── UserValidationController.php
│   ├── UserLogicController.php
│   └── UserDataController.php
│
├── handlers/
│   └── user_handler.php
│
└── index.php
```

---

# 🔵 1️⃣ Database

## 📁 config/database.php

```php
<?php

require_once __DIR__ . '/../core/Response.php';

class Database {

    private $host = "localhost";
    private $db_name = "test_db";
    private $username = "root";
    private $password = "";
    public $conn;

    public function connect() {
        try {
            $this->conn = new PDO(
                "mysql:host={$this->host};dbname={$this->db_name}",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $this->conn;
        } catch (PDOException $e) {
            Response::error("Koneksi database gagal", 500);
        }
    }
}
```

---

# 🔵 2️⃣ Response Generic

## 📁 core/Response.php

```php
<?php

class Response {

    public static function success($message, $data = null, $code = 200) {
        http_response_code($code);
        header("Content-Type: application/json");

        echo json_encode([
            "status" => true,
            "message" => $message,
            "data" => $data
        ]);
        exit;
    }

    public static function error($message, $code = 400, $data = null) {
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
```

---

# 🔵 3️⃣ User Success Message (Per Module)

## 📁 messages/UserMessage.php

```php
<?php

class UserMessage {

    private static $messages = [

        "CREATED" => "User berhasil dibuat",
        "UPDATED" => "User berhasil diperbarui",
        "DELETED" => "User berhasil dihapus",
        "FOUND"   => "User ditemukan"
    ];

    public static function get($key) {
        return self::$messages[$key] ?? "User message tidak ditemukan";
    }
}
```

---

# 🔵 4️⃣ User Error Message Controller

## 📁 messages/UserErrorMessage.php

```php
<?php

class UserErrorMessage {

    private static $messages = [

        "REQUIRED" => ":field wajib diisi",
        "STRING"   => ":field harus berupa string",
        "EMAIL"    => "Format email tidak valid",
        "MIN"      => ":field minimal :value karakter",
        "MAX"      => ":field maksimal :value karakter",
        "UNKNOWN_FIELD" => "Field :field tidak diperbolehkan",
        "TOO_MANY_FIELDS" => "Field yang dikirim terlalu banyak",
        "EMAIL_EXISTS" => "Email sudah terdaftar"
    ];

    public static function get($code, $field = null, $value = null) {

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
```

---

# 🔵 5️⃣ Model

## 📁 models/UserModel.php

```php
<?php

class UserModel {

    private $conn;
    private $table = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function emailExists($email) {
        $stmt = $this->conn->prepare("SELECT id FROM {$this->table} WHERE email = :email");
        $stmt->execute([":email" => $email]);
        return $stmt->rowCount() > 0;
    }

    public function save($data) {
        $stmt = $this->conn->prepare("
            INSERT INTO {$this->table} (name, email, password)
            VALUES (:name, :email, :password)
        ");
        return $stmt->execute($data);
    }
}
```

---

# 🔵 6️⃣ Validation Controller (Return Error Code)

## 📁 controllers/UserValidationController.php

```php
<?php

class UserValidationController {

    public function validate($data) {

        $allowedFields = ['name', 'email', 'password'];

        if (count($data) > count($allowedFields)) {
            return $this->fail("TOO_MANY_FIELDS");
        }

        foreach ($data as $key => $value) {
            if (!in_array($key, $allowedFields)) {
                return $this->fail("UNKNOWN_FIELD", $key);
            }
        }

        $rules = [
            "name" => "required|string|min:3|max:50",
            "email" => "required|email|max:100",
            "password" => "required|string|min:6|max:20"
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

                if ($rule === "email" &&
                    !filter_var($data[$field], FILTER_VALIDATE_EMAIL)) {
                    return $this->fail("EMAIL");
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

        return ["status" => true];
    }

    private function fail($code, $field = null, $value = null) {
        return [
            "status" => false,
            "error_code" => $code,
            "field" => $field,
            "value" => $value
        ];
    }
}
```

---

# 🔵 7️⃣ Logic Controller

## 📁 controllers/UserLogicController.php

```php
<?php

class UserLogicController {

    private $model;

    public function __construct($db) {
        $this->model = new UserModel($db);
    }

    public function process($data) {

        if ($this->model->emailExists($data['email'])) {
            return [
                "status" => false,
                "error_code" => "EMAIL_EXISTS"
            ];
        }

        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);

        return [
            "status" => true,
            "data" => $data
        ];
    }
}
```

---

# 🔵 8️⃣ Data Controller

## 📁 controllers/UserDataController.php

```php
<?php

class UserDataController {

    private $model;

    public function __construct($db) {
        $this->model = new UserModel($db);
    }

    public function store($data) {

        $saved = $this->model->save($data);

        if (!$saved) {
            return ["status" => false];
        }

        return ["status" => true];
    }
}
```

---

# 🔵 9️⃣ Handler (Orkestrator)

## 📁 handlers/user_handler.php

```php
<?php

header("Content-Type: application/json");

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../messages/UserMessage.php';
require_once __DIR__ . '/../messages/UserErrorMessage.php';
require_once __DIR__ . '/../controllers/UserValidationController.php';
require_once __DIR__ . '/../controllers/UserLogicController.php';
require_once __DIR__ . '/../controllers/UserDataController.php';

$input = json_decode(file_get_contents("php://input"), true);

$db = (new Database())->connect();

// 1️⃣ VALIDATION
$validation = new UserValidationController();
$validate = $validation->validate($input);

if (!$validate['status']) {
    $message = UserErrorMessage::get(
        $validate['error_code'],
        $validate['field'] ?? null,
        $validate['value'] ?? null
    );
    Response::error($message, 400);
}

// 2️⃣ LOGIC
$logic = new UserLogicController($db);
$process = $logic->process($input);

if (!$process['status']) {
    $message = UserErrorMessage::get($process['error_code']);
    Response::error($message, 400);
}

// 3️⃣ DATA
$dataController = new UserDataController($db);
$result = $dataController->store($process['data']);

if (!$result['status']) {
    Response::error("Gagal menyimpan data", 500);
}

Response::success(UserMessage::get("CREATED"), null, 201);
```

---

