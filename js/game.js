class TableroDinosaurios {
  constructor() {
    this.jugadas = JSON.parse(localStorage.getItem("jugadas")) || [];
    //usado para generar dinosaurios
    this.listaDinos = [
      "T-Rex",
      "Velociraptor",
      "Triceratops",
      "Stegosaurio",
      "Spinosaurio",
      "Anquilosaurio"
    ];

    this.reglasCasillas = {
        1: {nombre: "Bosque de Semejanza",
            puntos: (jugadasCasilla) => {
            let ret;
            switch (jugadasCasilla.length) {
                case 1: ret = 2;
                break;
                case 2: ret = 4;
                break;
                case 3: ret = 8;
                break;
                case 4: ret = 12;
                break;
                case 5: ret = 18;
                break;
                case 6: ret = 24;
                break;
            }
            return ret;
            },
            restriccion: (jugadasCasilla, nuevoDino) => {
            // solo dinos iguales después del primero
            // every devuelve verdadero si todos los elementos de un array cumplen con la condicion y falso
            // si siquiera uno lo rompe
            return (
                jugadasCasilla.length === 0 ||
                jugadasCasilla.every((j) => j.dinosaurio === nuevoDino)
            );
            }
        },
        2: {nombre: "Trío Frondoso",
            puntos: (jugadasCasilla) => (jugadasCasilla.length === 3 ? 7 : 0),
            //bypass ya que no hay restricciones, sin restriccion no se dejan aplicar dinosaurios a
            restriccion: () => true
        },
        3: { nombre: "Valle de las Parejas",
        puntos: (jugadasCasilla) => {
            // cuenta las parejas
            // es un contador por cada tipo de dinosaurio
            // si este llega a 2 es usado en los puntos via math.floor
            // ya que estoy, math.floor simplemente saca la coma, si es 2,#, osea dos coma algo
            // esto se volveria 2
            const contador = {};
            jugadasCasilla.forEach((j) => {
            contador[j.dinosaurio] = (contador[j.dinosaurio] || 0) + 1;
            });
            let puntos = 0;
            // cada pareja da 5 puntos
            // no lo llego a entender muy bien pero funciona
            // la base es que cuenta los elementos dentro del array y guarda
            // su nombre en la constante especie, de esta manera llendo por todas las especies en
            // el contador
            for (const especie in contador) {
            puntos += Math.floor(contador[especie] / 2) * 5;
            }
            return puntos;
        },
        restriccion: () => true
        },
        4: {nombre: "Rey de la Selva",
            puntos: (jugadasCasilla) => (jugadasCasilla.length === 1 ? 7 : 0),
            restriccion: () => true
            // ya que solo hay un tablero por ahora, no hay logica para el rey de la selva ya que
            // siempre tendrias la mayor cantidad de cada dinosaurio.
        },
        5: { nombre: "Territorio Diverso",
        puntos: (jugadasCasilla) => {
            let ret;
            switch (jugadasCasilla.length) {
                case 1: ret = 1;
                break;
                case 2: ret = 3;
                break;
                case 3: ret = 6;
                break;
                case 4: ret = 10;
                break;
                case 5: ret = 15;
                break;
                case 6: ret = 21;
                break;
            }
            return ret;
        },
        restriccion: (jugadasCasilla, nuevoDino) => {
            // no puede haber dos del mismo tipo
            // lo que hace .some es como .filter, pero para cuando encuentra uno de lo que esta buscando
            return !jugadasCasilla.some((j) => j.dinosaurio === nuevoDino);
        }
        },
        6: {
            nombre: "Isla Solitaria",
            puntos: (jugadasCasilla, todasJugadas) => {
                // revisa si es el unico con un filter
                let puntos = 0;
                jugadasCasilla.forEach((j) => {
                const mismos = todasJugadas.filter(
                    (otra) => otra.dinosaurio === j.dinosaurio
                );
                if (mismos.length === 1) {
                    puntos += 7;
                }
                });
                return puntos;
            },
        restriccion: () => true,
        },

        7: {
            nombre: "Río",
            // un punto por dinosaurio
            puntos: (jugadasCasilla) => jugadasCasilla.length * 1,
            restriccion: () => true,
        },
    };

    this.dinosActuales = JSON.parse(localStorage.getItem("dinosActuales")) || [];
    
    //esto es para que me acuerde yo, esto es como un if, la estructura es asi. condition ? valueIfTrue : valueIfFalse
    this.reposicionesRestantes = localStorage.getItem("reposicionesRestantes") !== null
    ? parseInt(localStorage.getItem("reposicionesRestantes"))
    : 6;

    this.partidaId = null;

    this.init();
  }

  //init, simplemente corre todas las variables para empezar el juego
 init() {
  fetch("../php/api/partida.php")
    .then(res => res.json())
    .then(data => {
      if (data.success && data.partida) {
        if (data.partida.estado === "finalizada") {
          console.log("Partida finalizada, comenzando nueva partida.");
          this.generarDinosauriosAleatorios();
          this.agregarEventosDrop();
          this.agregarEventoFinalizar();
          return;
        }

        this.partidaId = data.partida.id;
        this.jugadas = JSON.parse(data.partida.jugadas || "[]");
        this.dinosActuales = JSON.parse(data.partida.dinosActuales || "[]");
        if (data.partida.reposicionesRestantes !== null && !isNaN(data.partida.reposicionesRestantes)) {
          this.reposicionesRestantes = parseInt(data.partida.reposicionesRestantes);
        }
        this.mostrarDinosGuardados();
        this.cargarJugadas();
      } else if (this.dinosActuales.length > 0) {
        this.mostrarDinosGuardados();
      } else {
        this.generarDinosauriosAleatorios();
      }

      this.agregarEventosDrop();
      this.agregarEventoFinalizar();
    })
    .catch(err => {
      console.error("Error cargando partida:", err);
      if (this.dinosActuales.length > 0) {
        this.mostrarDinosGuardados();
      } else {
        this.generarDinosauriosAleatorios();
      }
      this.agregarEventosDrop();
      this.agregarEventoFinalizar();
    });
}

  //tomo un rato, borre y reescribi el codigo unas cuantas veces hasta que encontre como hacerlo
   generarDinosauriosAleatorios() {
    const contenedor = document.querySelector(".dinos-container");
    contenedor.innerHTML = "";
    this.dinosActuales = [];

    for (let i = 0; i < 6; i++) {
        const dino = this.crearDinosaurio(contenedor);
        //push, metodo de js, agrega un nuevo elemento al final de un array
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
    //no sabia como lidiar con IDs entonces checkee stack overflow y me encontre con esto
    //para explicar, toString(36) lo convierte a base 36 que es un tipo de encripcion, y el substring(2, 9)
    //hace que se remuevan unos simbolos que siempre aparecen en base 36, "0."
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
      //no fue divertido trabajar con funciones en funciones
      this.agregarEventosDrag();
      this.reposicionesRestantes--;
      console.log("Reposicion. Quedan:", this.reposicionesRestantes);
      this.guardarEstadoDinos();
    } else {
      console.log("No quedan mas dinosaurios.");
    }
  }

  //probablemente lo mas simple que e tenido que hacer fue editar esto
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
        //me acorde de /n de primero de utu y la verdad es la razon entera por la cual e podido
        //hacer lo de mostrar multiples dinosaurios
        casilla.textContent += `🦕 ${jugada.dinosaurio}\n`;
        }
      });
    }
  }

  guardarJugadas() {
    fetch("../php/api/partida.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        id: this.partidaId,
        jugadas: this.jugadas,
        dinosActuales: this.dinosActuales,
        reposicionesRestantes: this.reposicionesRestantes
        })
    })
    .then(res => res.json())
    .then(data => {
      if (!this.partidaId && data.id) this.partidaId = data.id; // guardamos ID
      console.log("Partida guardada:", data);
    })
    .catch(err => console.error("Error al guardar partida:", err));
  }

    //boton de finalizar temporal
    resetearJugadas() {
    localStorage.removeItem("jugadas");
    localStorage.removeItem("dinosActuales");
    localStorage.removeItem("reposicionesRestantes");

    document.querySelectorAll(".casilla").forEach((casilla) => {
      casilla.textContent = casilla.dataset.original;
      delete casilla.dataset.cargada;
    });

    const contenedor = document.querySelector(".dinos-container");
    if (contenedor) contenedor.innerHTML = "";

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

  //esto fue una pesidilla para lidiar con
  agregarEventosDrop() {
    document.querySelectorAll(".casilla").forEach((casilla) => {
      casilla.addEventListener("dragover", (e) => e.preventDefault());
      
      casilla.addEventListener("drop", (e) => {
        e.preventDefault();
        
        const dino = e.dataTransfer.getData("text/plain");
        const idCasilla = casilla.dataset.casilla;
        //consigue la restriccion
        const regla = this.reglasCasillas[idCasilla];

        //mas filtros
        const jugadasEnCasilla = this.jugadas.filter((j) => j.casilla === idCasilla);

        //verificacion para restricciones
        if (regla && !regla.restriccion(jugadasEnCasilla, dino)) {
        alert(`No puedes colocar ese dinosaurio en ${casilla.dataset.original}.`);
        return;
        }

        const limite = parseInt(casilla.dataset.limite) || 1;
        
        //mi mas humilde manera de encontrar cuantos dinosaurios hay en la casilla. filter filtra
        //aqui por todas las jugadas intentando encontrar jugadas las cuales tengan la id de casilla
        //igual a la nuestra
        const cantidadActual = this.jugadas.filter(
            (j) => j.casilla === idCasilla
        ).length;

        if (cantidadActual < limite) {
          casilla.textContent += `\n🦕 ${dino}`;

          this.jugadas.push({
          casilla: idCasilla,
          dinosaurio: dino
        });

        //datatransfer y todo eso es parte del dragstart event listener viene por defecto
        //simplemente obtiene y guarda el id del dinosaurio
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
        this.guardarJugadas();
        }
      });
    });
  }

  //funcion que eventualmente se va a mandar a la pagina de puntos
  calcularPuntosTotales() {
    let total = 0;
    // lo mismo que en el resinto o casilla 3, pradera de amor
    // crea una id por cada elemento en this.reglasCasillas y le corre un filtro de id
    // simplemente encuentra las jugadas en esa casilla
    // y obtiene la regla, la cual es usada en el siguiente if
    for (const id in this.reglasCasillas) {
        const jugadasCasilla = this.jugadas.filter(j => j.casilla === id);
        const regla = this.reglasCasillas[id];

        // si no hubo ninuna jugada en la casilla o resinto, se descarta
        // checkea si tiene una id en la tabla de reglas para que no se me rompa el codigo por las dudas
        // se asegura que esta tenga una funcion llamada puntos, de lo cual es el "typeof"
        // esto es porque mientras que estaba haciendo el codigo me vino conveniente ya que
        // no habia construido todos los sets para obtener puntos
        if (jugadasCasilla.length > 0 && regla && typeof regla.puntos === "function") {
            // si la funcion de puntos puede tener 2 parametros (osea que sea compleja) se pasan las jugadas
            // si las jugadas no son necesitadas, no se llaman, por ejemplo con el rio.
            if (regla.puntos.length > 1) {
                total += regla.puntos(jugadasCasilla, this.jugadas);
            } else {
                total += regla.puntos(jugadasCasilla);
            }
        }

        // T-REX
        const tieneTRex = jugadasCasilla.some(j => j.dinosaurio === "T-Rex");
        // 7 es el rio, no suma el T-rex en el rio
        if (tieneTRex && id !== "7") {
        total += 1;
        }
    }

  console.log("Puntaje total:", total);
  return total;
  }

  agregarEventoFinalizar() {
  document.getElementById("fin").addEventListener("click", () => {
    const puntos = this.calcularPuntosTotales();

    fetch("../php/api/partida.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: this.partidaId,
        jugadas: this.jugadas,
        dinosActuales: this.dinosActuales,
        reposicionesRestantes: this.reposicionesRestantes,
        puntos: puntos,
        estado: "finalizada"
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Partida finalizada guardada:", data);
      
      this.resetearJugadas();
      window.location.href = "result.html";
    })
    .catch(err => {
      console.error("Error al guardar partida finalizada:", err);
      alert(`Error al guardar partida. Puntos: ${puntos}`);
      this.resetearJugadas();
      location.reload();
    });
  });
}
}

new TableroDinosaurios();