<?php
// Definimos la clase User, que nos permitirá interactuar con la tabla 'users' de la base de datos
class User {
    // Propiedad privada para almacenar la conexión a la base de datos
    private $conn;
    // Propiedad privada que contiene el nombre de la tabla a usar
    private $table = "users";

    // El constructor recibe una conexión a la base de datos y la guarda en la propiedad $conn
    public function __construct($db) {
        $this->conn = $db;
    }

    // Método para obtener un usuario específico por su ID
    public function login($gmail, $password) {
        $query = "SELECT gmail, nombre, contraseña, lang FROM {$this->table} WHERE gmail = :gmail";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":gmail", $gmail, PDO::PARAM_STR);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['contraseña'])) {
            return ["success" => true, "nombre" => $user['nombre'], "gmail" => $user['gmail']];
        } else {
            return ["error" => "Correo o contraseña incorrectos"];
        }
    }

    public function register($gmail, $nombre, $password) {
        // Verifica si ya existe un usuario con ese correo
        $query = "SELECT gmail FROM {$this->table} WHERE gmail = :gmail";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":gmail", $gmail);
        $stmt->execute();
        if ($stmt->fetch(PDO::FETCH_ASSOC)) {
            return ["error" => "El correo ya esta registrado"];
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $insert = "INSERT INTO {$this->table} (gmail, nombre, contraseña) VALUES (:gmail, :nombre, :password)";
        $stmt = $this->conn->prepare($insert);
        $stmt->bindParam(":gmail", $gmail);
        $stmt->bindParam(":nombre", $nombre);
        $stmt->bindParam(":password", $hashedPassword);

        if ($stmt->execute()) {
            return ["success" => true];
        } else {
            return ["error" => "Error al registrar el usuario"];
        }
    }

    public function updateLang($gmail, $lang) {
    $query = "UPDATE {$this->table} SET lang = :lang WHERE gmail = :gmail";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":lang", $lang);
    $stmt->bindParam(":gmail", $gmail);

    if ($stmt->execute()) {
        return true;
    } else {
        return false;
    }
}

}
