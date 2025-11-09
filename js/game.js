class TableroDinosaurios {
  constructor() {
    this.jugadas = JSON.parse(localStorage.getItem("jugadas")) || [];
    this.init();
  }

  init() {
    this.cargarJugadas();
    this.agregarEventosDrag();
    this.agregarEventosDrop();
    this.agregarEventoFinalizar();
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
    });
    this.jugadas = [];
  }

  agregarEventosDrag() {
    document.querySelectorAll(".dino").forEach((dino) => {
      dino.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", dino.dataset.dino);
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
          const dino = e.dataTransfer.getData("text/plain");
          casilla.textContent += `\n🦕 ${dino}`;

          this.jugadas.push({
          casilla: idCasilla,
          dinosaurio: dino
        });
          this.guardarJugadas();
        }
      });
    });
  }

  agregarEventoFinalizar() {
    document.getElementById("fin").addEventListener("click", () => {
      this.resetearJugadas();
    });
  }
}

new TableroDinosaurios();