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

    // Método para obtener un animal específico por su ID
    public function login($gmail, $password) {
        $query = "SELECT gmail, nombre, contraseña, lang FROM {$this->table} WHERE gmail = :gmail";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":gmail", $gmail, PDO::PARAM_STR);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Si no existe el usuario o la contraseña no es la misma devuelve un vacio
        //if (!$user || !password_verify($password, $user['contraseña'])) {
        //    return null;
        //}

        //Mientras que las contraseñas no esten Hasheadas:
        if (!$user || $user['contraseña'] !== $password) {
            return null;
        }
        return $user;
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

        $insert = "INSERT INTO {$this->table} (gmail, nombre, contraseña) VALUES (:gmail, :nombre, :password)";
        $stmt = $this->conn->prepare($insert);
        $stmt->bindParam(":gmail", $gmail);
        $stmt->bindParam(":nombre", $nombre);
        $stmt->bindParam(":password", $password);

        if ($stmt->execute()) {
            return ["success" => true];
        } else {
            return ["error" => "Error al registrar el usuario"];
        }
    }

}
