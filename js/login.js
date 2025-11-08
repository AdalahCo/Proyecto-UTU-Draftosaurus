// Se define una clase llamada ApiUser para interactuar con la API de fauna
class ApiUser {
    // El constructor recibe la URL base de la API y la guarda en la instancia
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    // Método para obtener todos los animales de la API
    getAll() {
        // Realiza una petición fetch a la URL base
        return fetch(this.baseUrl)
            // Cuando recibe la respuesta, la convierte a JSON
            .then(response => response.json());
        }

    // Método para obtener un loginGmail por su ID
    login(gmail, password) {
        return fetch(this.baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gmail: gmail, contraseña: password })
        })
        .then(response => response.json());
    }
}

// Se crea una instancia de ApiUser con la URL de la API local
const api = new ApiUser("../php/api/index.php");

// Se obtiene el elemento del DOM donde se mostrarán los resultados
const mensaje = document.getElementById("mensaje");

const submit = document.getElementById("formRegistro");

submit.addEventListener("submit", (e) => {
    e.preventDefault();

    const loginGmail = document.getElementById("correo").value.trim();
    const loginPass = document.getElementById("contraseña").value.trim();
    const mensaje = document.getElementById("mensaje");

    if (!loginGmail || !loginPass) {
        mensaje.innerHTML = `<p style="color:red;">Por favor, complete ambos campos.</p>`;
        return;
    }

    api.login(loginGmail, loginPass)
    .then(loginData => {
        if (loginData && loginData.success && loginData.user) {
            window.location.href = "user.html";
        } else {
            mensaje.innerHTML = `<p>${loginData.error || "Información incorrecta."}</p>`;
        }
        console.log("Respuesta del servidor:", loginData);
        })
        .catch(err => {
            console.error("Error en el login:", err);
            mensaje.innerHTML = `<p>Error de conexión al servidor.</p>`;
        });
});