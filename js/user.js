const nameOutput = document.getElementById("nameInput");
const gmailOutput = document.getElementById("gmailInput");

fetch("../php/api/index.php", {
  method: "GET",
  credentials: "include"
})
.then(res => res.json())
.then(data => {
  if (!data.logged) window.location.href = "login.html";
  else console.log("Usuario logueado:", data.user);
  nameOutput.innerHTML = `<h2>${data.user.nombre}</h2>`;
  gmailOutput.innerHTML = `<h2>${data.user.gmail}</h2>`;
});