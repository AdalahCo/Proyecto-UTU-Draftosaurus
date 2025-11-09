class TableroDinosaurios {
  constructor() {
    this.jugadas = JSON.parse(localStorage.getItem("jugadas")) || [];
    this.listaDinos = [
      "T-Rex",
      "Velociraptor",
      "Triceratops",
      "Stegosaurio",
      "Spinosaurio",
      "Anquilosaurio"
    ];
    this.init();
  }

  init() {
    this.generarDinosauriosAleatorios();
    this.cargarJugadas();
    this.agregarEventosDrop();
    this.agregarEventoFinalizar();
  }

generarDinosauriosAleatorios() {
    const contenedor = document.querySelector(".dinos-container");
    contenedor.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * this.listaDinos.length);
        const dinoNombre = this.listaDinos[randomIndex];
        const emoji = dinoNombre === "T-Rex" ? "🦖" : "🦕";

        const dinoDiv = document.createElement("div");
        dinoDiv.classList.add("dino");
        dinoDiv.setAttribute("draggable", "true");
        dinoDiv.dataset.dino = dinoNombre;
        dinoDiv.textContent = `${emoji} ${dinoNombre}`;
        dinoDiv.dataset.id = `dino-${i}-${Date.now()}`;

        contenedor.appendChild(dinoDiv);
    }
    this.agregarEventosDrag();
}

  cargarJugadas() {
    if (this.jugadas.length > 0) {
      this.jugadas.forEach((jugada) => {
        const casilla = document.querySelector(
          `[data-casilla="${jugada.casilla}"]`
        );
        if (casilla) {
          if (!casilla.dataset.cargada) {
          casilla.textContent = casilla.dataset.original + "\n";
          casilla.dataset.cargada = "true";
        }
        casilla.textContent += `🦕 ${jugada.dinosaurio}\n`;
        }
      });
    }
  }

  guardarJugadas() {
    localStorage.setItem("jugadas", JSON.stringify(this.jugadas));
    console.log("Jugadas:", this.jugadas);
  }

  resetearJugadas() {
    localStorage.removeItem("jugadas");
    document.querySelectorAll(".casilla").forEach((casilla) => {
      casilla.textContent = casilla.dataset.original;
      delete casilla.dataset.cargada;
    });
    this.jugadas = [];
  }

  agregarEventosDrag() {
    document.querySelectorAll(".dino").forEach((dino) => {
      dino.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", dino.dataset.dino);
        e.dataTransfer.setData("id", dino.dataset.id);
      });
    });
  }

  agregarEventosDrop() {
    document.querySelectorAll(".casilla").forEach((casilla) => {
      casilla.addEventListener("dragover", (e) => e.preventDefault());
      
      casilla.addEventListener("drop", (e) => {
        e.preventDefault();
        
        const dino = e.dataTransfer.getData("text/plain");
        const idCasilla = casilla.dataset.casilla;
        const limite = parseInt(casilla.dataset.limite) || 1;

        const cantidadActual = this.jugadas.filter(
            (j) => j.casilla === idCasilla
        ).length;

        if (cantidadActual < limite) {
          casilla.textContent += `\n🦕 ${dino}`;

          this.jugadas.push({
          casilla: idCasilla,
          dinosaurio: dino
        });
        
        this.guardarJugadas();

        const dinoId = e.dataTransfer.getData("id");
        const dinoElemento = document.querySelector(`.dino[data-id="${dinoId}"]`);
        if (dinoElemento) dinoElemento.remove();

        }
      });
    });
  }

  agregarEventoFinalizar() {
    document.getElementById("fin").addEventListener("click", () => {
      this.resetearJugadas();
      location.reload();
    });
  }
}

new TableroDinosaurios();