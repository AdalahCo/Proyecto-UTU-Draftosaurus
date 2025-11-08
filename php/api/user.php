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

    // Método para obtener todos los registros de users de la base de datos
    public function getAll() {
        // Creamos la consulta SQL para seleccionar los campos deseados de la tabla 'users'
        $query = "SELECT `gmail`, `nombre`, `contraseña`, `lang` FROM {$this->table}";
        // Preparamos la consulta usando la conexión a la base de datos para evitar inyecciones SQL
        $stmt = $this->conn->prepare($query);
        // Ejecutamos la consulta preparada
        $stmt->execute();
        // Obtenemos todos los resultados como un array asociativo y lo devolvemos
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

        // Parte de abajo DEFAULT sin usar por ahora por las dudas no tocar

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
}
