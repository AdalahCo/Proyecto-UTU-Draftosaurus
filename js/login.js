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
    getById(id) {
        // Realiza una petición fetch a la URL base agregando el parámetro id
        return fetch(`${this.baseUrl}?id=${id}`)
            // Convierte la respuesta a JSON
            .then(response => response.json());
    }
}

// Se crea una instancia de ApiUser con la URL de la API local
const api = new ApiUser("../php/api/index.php");

// Se obtiene el elemento del DOM donde se mostrarán los resultados
const nameOutput = document.getElementById("nameInput");
const gmailOutput = document.getElementById("gmailInput");

const loginGmail = prompt("Ingrese su Gmail:");
const loginPass = prompt("Ingrese su contraseña:");

// Si el usuario ingresó un valor
if (loginGmail) {
    // Llama al método getById de la API con el ID proporcionado
    api.getById(loginGmail).then(loginData => {
        if (loginData && loginData.gmail) {
            nameOutput.innerHTML = `<h2>${loginData.nombre}</h2>`;
            gmailOutput.innerHTML = `<h2>${loginData.gmail}</h2>`;
        } else {
            nameOutput.innerHTML = `<p>No se encontró el usuario con gmail ${loginGmail}.</p>`;
        }
    })
};