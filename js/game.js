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
    this.dinosActuales = JSON.parse(localStorage.getItem("dinosActuales")) || []; // dinos visibles
    
    this.reposicionesRestantes = localStorage.getItem("reposicionesRestantes") !== null
    ? parseInt(localStorage.getItem("reposicionesRestantes"))
    : 6;

    this.init();
  }

  init() {
    if (this.dinosActuales.length > 0) {
      this.mostrarDinosGuardados();
    } else {
      this.generarDinosauriosAleatorios();
    }
    this.cargarJugadas();
    this.agregarEventosDrop();
    this.agregarEventoFinalizar();
  }

   generarDinosauriosAleatorios() {
    const contenedor = document.querySelector(".dinos-container");
    contenedor.innerHTML = "";
    this.dinosActuales = [];

    for (let i = 0; i < 6; i++) {
        const dino = this.crearDinosaurio(contenedor);
        this.dinosActuales.push(dino);
    }
    this.agregarEventosDrag();
    this.guardarEstadoDinos();
    }

    mostrarDinosGuardados() {
        const contenedor = document.querySelector(".dinos-container");
        contenedor.innerHTML = "";

        this.dinosActuales.forEach((dinoData) => {
        const dinoDiv = document.createElement("div");
        dinoDiv.classList.add("dino");
        dinoDiv.setAttribute("draggable", "true");
        dinoDiv.dataset.dino = dinoData.nombre;
        dinoDiv.dataset.id = dinoData.id;
        dinoDiv.textContent = dinoData.texto;

        contenedor.appendChild(dinoDiv);
    });
    this.agregarEventosDrag();
  }

 crearDinosaurio(contenedor) {
    const randomIndex = Math.floor(Math.random() * this.listaDinos.length);
    const dinoNombre = this.listaDinos[randomIndex];
    const emoji = dinoNombre === "T-Rex" ? "🦖" : "🦕";
    const id = `dino-${Math.random().toString(36).substring(2, 9)}`;
    const texto = `${emoji} ${dinoNombre}`;

    const dinoDiv = document.createElement("div");
    dinoDiv.classList.add("dino");
    dinoDiv.setAttribute("draggable", "true");
    dinoDiv.dataset.dino = dinoNombre;
    dinoDiv.dataset.id = id;
    dinoDiv.textContent = texto;

    contenedor.appendChild(dinoDiv);

    return { nombre: dinoNombre, id, texto };
  }

  reponerDinosaurio() {
    if (this.reposicionesRestantes > 0) {
      const contenedor = document.querySelector(".dinos-container");
      const nuevoDino = this.crearDinosaurio(contenedor);
      this.dinosActuales.push(nuevoDino);
      this.agregarEventosDrag();
      this.reposicionesRestantes--;
      console.log("Reposición! Restan:", this.reposicionesRestantes);
      this.guardarEstadoDinos();
    } else {
      console.log("No quedan más dinosaurios para reponer.");
    }
  }

  guardarEstadoDinos() {
    localStorage.setItem("dinosActuales", JSON.stringify(this.dinosActuales));
    localStorage.setItem(
      "reposicionesRestantes",
      this.reposicionesRestantes.toString()
    );
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
    this.guardarEstadoDinos();
    console.log("Jugadas:", this.jugadas);
  }

  resetearJugadas() {
    localStorage.removeItem("jugadas");
    localStorage.removeItem("dinosActuales");
    localStorage.removeItem("reposicionesRestantes");

    document.querySelectorAll(".casilla").forEach((casilla) => {
      casilla.textContent = casilla.dataset.original;
      delete casilla.dataset.cargada;
    });

    this.jugadas = [];
    this.dinosActuales = [];
    this.reposicionesRestantes = 6;
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
        if (dinoElemento) {
            dinoElemento.remove();
            this.dinosActuales = this.dinosActuales.filter(
              (d) => d.id !== dinoId
            );
            this.guardarEstadoDinos();
          }

        this.reponerDinosaurio();
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