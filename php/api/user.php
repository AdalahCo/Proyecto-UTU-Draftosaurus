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
    public function getById($id) {
        // Creamos la consulta SQL con un marcador de posición para el ID
        $query = "SELECT `gmail`, `nombre`, `contraseña`, `lang` FROM {$this->table} WHERE gmail = :id";
        // Preparamos la consulta usando la conexión a la base de datos
        $stmt = $this->conn->prepare($query);
        // Asociamos el valor recibido en $id al marcador ':id' en la consulta, asegurando que sea un entero
        $stmt->bindParam(":id", $id, PDO::PARAM_STR);
        // Ejecutamos la consulta preparada
        $stmt->execute();
        // Obtenemos el resultado como un array asociativo (solo un registro) y lo devolvemos
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
