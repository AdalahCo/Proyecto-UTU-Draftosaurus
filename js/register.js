const submit = document.getElementById("formRegistro");

submit.addEventListener("submit", (e) => {
    e.preventDefault();
    const nam = document.getElementById("nombre").value.trim();
    const con = document.getElementById("contraseña").value.trim();
    const email = document.getElementById("correo").value.trim();

    if (!nombre || !correo || !contraseña) {
        alert("Debe de completar todos los campos.");
        return;
    }

    fetch("../php/api/index.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: "register",
            nombre: nam,
            gmail: email,
            contraseña: con
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Respuesta del servidor:", data);

        if (data.success) {
            alert("Usuario registrado con éxito. Redirigiendo a pagina de usuario...");
            window.location.href = "login.html";
        } else {
            alert(data.error || "Error al registrarse");
        }
    })
    .catch(err => {
        console.error("Error en el registro:", err);
        alert("Error de conexión al servidor");
    });
});