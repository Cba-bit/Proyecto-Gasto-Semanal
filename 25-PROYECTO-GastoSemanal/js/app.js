// Variables y selectores
const formulario = document.querySelector("#agregar-gasto")
const gastoListado = document.querySelector("#gastos ul")


// Eventos
eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto)

  formulario.addEventListener("submit", agregarGasto)
}



//Clases
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    console.log(this.gastos);
    this.calcularRestante();
  }

  calcularRestante() {
    const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0)
    this.restante = this.presupuesto - gastado

    console.log(this.restante);
  }

}

class UI {
  insertarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }


  imprimirAlerta(mensaje, tipo) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert")

    if (tipo === "error") {
      divMensaje.classList.add("alert-danger")
    } else {
      divMensaje.classList.add("alert-success")
    }

    // Mensaje de error
    divMensaje.textContent = mensaje;

    //Insertar en el HTML
    document.querySelector(".primario").insertBefore(divMensaje, formulario)

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  agregarGastoListado(gastos) {
    this.limpiarHTML();
    gastos.forEach(gasto => {
      const { cantidad, nombre, id } = gasto

      // Crear un LI
      const nuevoGasto = document.createElement("li")
      nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center"
      nuevoGasto.dataset.id = id;

      // Agregar el HTML del gasto
      nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $${cantidad} </span>`

      // Boton para borrar
      const btnBorrar = document.createElement("button")
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto")
      btnBorrar.innerHTML = "Borrar &times;"
      nuevoGasto.appendChild(btnBorrar);

      // Insertar al html
      gastoListado.appendChild(nuevoGasto)
    })
  }
  limpiarHTML() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild)
    }
  }

  actualizarRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }
}

const ui = new UI();
let presupuesto;

// Funciones
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("Cuál es tu presupuesto?")

  // console.log(Number(presupuestoUsuario));

  if (presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
    window.location.reload();
  }

  presupuesto = new Presupuesto(presupuestoUsuario);
  console.log(presupuesto);

  ui.insertarPresupuesto(presupuesto);
}


// Añade gastos

function agregarGasto(e) {
  e.preventDefault();

  // Leer los datos del formulario
  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  if (nombre === "" | cantidad === "") {
    ui.imprimirAlerta("Ambos campos son obligatorios", "error")
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta("Cantidad incorrecta", "error")
    return;
  }

  // Generar un objeto con el gasto.

  const gasto = { nombre, cantidad, id: Date.now() };
  presupuesto.nuevoGasto(gasto)

  ui.imprimirAlerta("Gasto agregado correctamente")

  // Imprime los gastos
  const { gastos, restante } = presupuesto
  ui.agregarGastoListado(gastos)
  ui.actualizarRestante(restante)
  // Reinicia el formulario
  formulario.reset();
}
