<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");
// Establece el tipo de contenido de la respuesta a JSON y el juego de caracteres a UTF-8

// Permite que cualquier origen (dominio) acceda a este recurso (CORS)
header("Access-Control-Allow-Origin: *");

// Incluye el archivo Database.php, que contiene la clase para la conexión a la base de datos
require_once "database.php";

// Incluye el archivo Animal.php, que contiene la clase para manejar los animales
require_once "user.php";

// Crea una nueva instancia de la clase Database
$database = new Database();

// Llama al método connect() para obtener la conexión a la base de datos y la guarda en $db
$db = $database->connect();

// Crea una nueva instancia de la clase Animal, pasándole la conexión a la base de datos
$user = new User($db);

// Obtiene el método HTTP de la petición (por ejemplo, GET, POST, etc.)
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['gmail']) && isset($data['contraseña'])) {
        $gmail = $data['gmail'];
        $password = $data['contraseña'];
        $userData = $user->login($gmail, $password);

        if ($userData) {
            $_SESSION['user'] = $userData;
            echo json_encode(["success" => true, "user" => $userData]);
        } else {
            echo json_encode(["error" => "Informacion incorrecta"]);
        }
    } else {
        echo json_encode(["error" => "Faltan datos"]);
    }

} elseif ($method === 'GET') {
    if (isset($_SESSION['user'])) {
        echo json_encode(["logged" => true, "user" => $_SESSION['user']]);
    } else {
        echo json_encode(["logged" => false]);
    }
} elseif ($method === 'DELETE') {
    session_destroy();
    echo json_encode(["logout" => true]);

} else {
    echo json_encode(["error" => "Método no permitido"]);
}