document.addEventListener("DOMContentLoaded", () => {
  const nameOutputs = document.querySelectorAll(".nameInput");
  const gmailOutputs = document.querySelectorAll(".gmailInput");
  const logoutButtons = document.querySelectorAll(".logout-btn");
  console.log("logout buttons found:", logoutButtons.length);

  function logoutUser() {
    console.log("logoutUser called");
    fetch("../php/api/index.php", {
      method: "DELETE",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log("logout response:", data);
        if (data.logout) {
          window.location.href = "login.html";
        } else {
          console.warn("Logout no exitoso:", data);
        }
      })
      .catch(err => {
        console.error("Error al cerrar sesión:", err);
      });
  }

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

  if (logoutButtons.length === 0) {
    console.warn("No se encontraron botones .logout-btn");
  }

  if (logoutButtons && logoutButtons.length > 0) {
    logoutButtons.forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        logoutUser();
      });
    });
  } else {
    console.warn("No se encontraron botones .logout-btn al cargar");
  }
});