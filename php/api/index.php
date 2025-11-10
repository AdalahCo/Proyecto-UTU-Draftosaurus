<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");
// Establece el tipo de contenido de la respuesta a JSON y el juego de caracteres a UTF-8

// Permite que cualquier origen (dominio) acceda a este recurso (CORS)
header("Access-Control-Allow-Origin: *");

// Incluye el archivo Database.php, que contiene la clase para la conexión a la base de datos
require_once "database.php";

// Incluye el archivo User.php, que contiene la clase para manejar los usuarios
require_once "user.php";

// Crea una nueva instancia de la clase Database
$database = new Database();

// Llama al método connect() para obtener la conexión a la base de datos y la guarda en $db
$db = $database->connect();

// Crea una nueva instancia de la clase User, pasándole la conexión a la base de datos
$user = new User($db);

// Obtiene el método HTTP de la petición (por ejemplo, GET, POST, etc.)
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['action']) && $data['action'] === 'register') {
        if (isset($data['gmail'], $data['nombre'], $data['contraseña'])) {
            $gmail = $data['gmail'];
            $nombre = $data['nombre'];
            $password = $data['contraseña'];

            $result = $user->register($gmail, $nombre, $password);
            echo json_encode($result);
        } else {
            echo json_encode(["error" => "Faltan datos"]);
        }
        exit;
    }
    
    if (isset($data['gmail']) && isset($data['contraseña'])) {
        $gmail = $data['gmail'];
        $password = $data['contraseña'];
        $userData = $user->login($gmail, $password);

        if (isset($userData['success']) && $userData['success'] === true) {
            $_SESSION['user'] = $userData;
            echo json_encode(["success" => true, "user" => $userData]);
        } else {
            echo json_encode(["error" => $userData['error'] ?? "Información incorrecta"]);
        }
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

} elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($_SESSION['user'])) {
        $gmail = $_SESSION['user']['gmail'];
        $lang = $data['lang'] ?? null;

        if ($lang) {
            if ($user->updateLang($gmail, $lang)) {
                // Actualizamos también el valor en la sesión actual
                $_SESSION['user']['lang'] = $lang;
                echo json_encode(["success" => true, "lang" => $lang]);
            } else {
                echo json_encode(["error" => "No se pudo actualizar el idioma."]);
            }
        } else {
            echo json_encode(["error" => "No se especificó idioma."]);
        }
    }
} else {
    echo json_encode(["error" => "Método no permitido"]);
}