fetch("../php/api/index.php", {
  method: "GET",
  credentials: "include"
})
.then(res => res.json())
.then(data => {
  if (!data.logged) window.location.href = "login.html";
  else console.log("Usuario logueado:", data.user);
});

function cambiarIdioma(newLang) {
    fetch("../php/api/index.php", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ lang: newLang })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (data.success) {
            alert(`Idioma actualizado a ${data.lang}`);
        } else {
            alert(data.error || "Error al actualizar idioma");
        }
    })
    .catch(err => console.error("Error al conectar:", err));
}

const select = document.getElementById("selectLang");

document.querySelectorAll(".lang-flag").forEach(flag => {
  flag.addEventListener("click", (e) => {
    const lang = e.target.dataset.lang;
    select.value = lang;
    console.log("Idioma seleccionado:", lang);
    cambiarIdioma(lang);
  })
})