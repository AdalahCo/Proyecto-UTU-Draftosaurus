<?php
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

// Si el método es GET, se procesan las peticiones para obtener datos
if ($method === 'GET') {
    // Si se ha pasado un parámetro 'id' por la URL, se busca un user por su id
    if (isset($_GET['id'], $_GET['password'])) {
        // Llama al método getById() de la clase Animal, pasando el id recibido
        $data = $user->login($_GET['id'], $_GET['password']);
        // Si se encuentra el user, se devuelve en formato JSON; si no, se devuelve un mensaje de error
        echo json_encode($data ? $data : ["mensaje" => "Animal no encontrado"]);
    } else {
        // Si no se pasa un id, se obtienen todos los animales llamando a getAll()
        $data = $user->getAll();
        // Devuelve la lista de animales en formato JSON
        echo json_encode($data);
    }
// Si el método no es GET, checkea si es POST, si no, se devuelve un mensaje de error indicando que el método no está permitido
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['gmail']) && isset($data['contraseña'])) {
        $gmail = $data['gmail'];
        $password = $data['contraseña'];
        $userData = $user->login($gmail, $password);

        if ($userData) {
            echo json_encode($userData);
            exit;
        } else {
            echo json_encode(["error" => "Info incorrecta"]);
            exit;
        }
    } else {
        echo json_encode(["error" => "Faltan datos"]);
    }

} else {
    echo json_encode(["error" => "Método no permitido"]);
}
?>
