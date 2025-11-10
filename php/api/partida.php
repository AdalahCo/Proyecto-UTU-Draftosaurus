<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT");

require_once "database.php";

$db = (new Database())->connect();

if (!isset($_SESSION['user'])) {
    echo json_encode(["error" => "No hay sesión activa"]);
    exit;
}

$gmail = $_SESSION['user']['gmail'];
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $jugadas = json_encode($data['jugadas'] ?? []);
    $dinos = json_encode($data['dinosActuales'] ?? []);
    $repos = intval($data['reposicionesRestantes'] ?? 6);
    $puntos = intval($data['puntos'] ?? 0);
    $estado = $data['estado'] ?? 'en curso';
    $horaFinalizacion = ($estado === 'finalizada') ? date("H:i:s") : null;

    if (!empty($data['id'])) {
        $update = $db->prepare("
            UPDATE partidas
            SET jugadas = :jugadas,
                dinosActuales = :dinos,
                reposicionesRestantes = :repos,
                puntos = :puntos,
                estado = :estado,
                horaFinalizacion = :horaFinalizacion
            WHERE id = :id
        ");
        $update->bindParam(":jugadas", $jugadas);
        $update->bindParam(":dinos", $dinos);
        $update->bindParam(":repos", $repos);
        $update->bindParam(":puntos", $puntos);
        $update->bindParam(":estado", $estado);
        $update->bindParam(":horaFinalizacion", $horaFinalizacion);
        $update->bindParam(":id", $data['id']);
        $update->execute();

        echo json_encode(["success" => true, "id" => $data['id'], "message" => "Partida actualizada"]);
    } else {
        $insert = $db->prepare("
            INSERT INTO partidas (gmail, jugadas, dinosActuales, reposicionesRestantes, puntos, estado)
            VALUES (:gmail, :jugadas, :dinos, :repos, :puntos, :estado)
        ");
        $insert->bindParam(":gmail", $gmail);
        $insert->bindParam(":jugadas", $jugadas);
        $insert->bindParam(":dinos", $dinos);
        $insert->bindParam(":repos", $repos);
        $insert->bindParam(":puntos", $puntos);
        $insert->bindParam(":estado", $estado);
        $insert->execute();

        $lastId = $db->lastInsertId();
        echo json_encode(["success" => true, "id" => $lastId, "message" => "Partida guardada"]);
    }
}

elseif ($method === 'GET') {
    $stmt = $db->prepare("
        SELECT id, jugadas, dinosActuales, reposicionesRestantes, puntos, estado, horaFinalizacion
        FROM partidas
        WHERE gmail = :gmail
        ORDER BY id DESC
        LIMIT 1
    ");
    $stmt->bindParam(":gmail", $gmail);
    $stmt->execute();

    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($data) {
        echo json_encode(["success" => true, "partida" => $data]);
    } else {
        echo json_encode(["success" => false, "message" => "No hay partida guardada"]);
    }
}
?>