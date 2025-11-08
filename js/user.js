const nameOutputs = document.querySelectorAll(".nameInput");
const gmailOutputs = document.querySelectorAll(".gmailInput");
const submit = document.getElementById("logout");

fetch("../php/api/index.php", {
  method: "GET",
  credentials: "include"
})
.then(res => res.json())
.then(data => {
  if (!data.logged) window.location.href = "login.html";
  else console.log("Usuario logueado:", data.user);
    nameOutputs.forEach(el => {
      el.innerHTML = `<h2>${data.user.nombre}</h2>`;
    });
    gmailOutputs.forEach(el => {
      el.innerHTML = `<h2>${data.user.gmail}</h2>`;
    });
});

submit.addEventListener("click", (e) => {
    e.preventDefault();
    fetch("../php/api/index.php", {
        method: "DELETE",
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
      if (data.logout) {
        window.location.href = "login.html";
      }
    })
    .catch(err => {
      console.error("Error logging out:", err);
    });
});