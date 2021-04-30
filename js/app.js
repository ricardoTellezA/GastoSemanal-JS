const formulario = document.querySelector('#agregar-gasto');
const gastosListado = document.querySelector('#gastos ul');

events();
function events() {
    document.addEventListener('DOMContentLoaded', cargarPregunta);
    formulario.addEventListener('submit', enviarGasto);
    gastosListado.addEventListener('click',borrarGasto);
}




//CLASES

class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto),
            this.gasto = Number(presupuesto),
            this.gastos = []

    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        ui.listado(this.gastos);
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gasto = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.gasto = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id.toString() !== id);
        this.calcularRestante();
        ui.listado(this.gastos);
    }
}

class UI {

    incertarPresupuesto(presupuestoUsuario) {
        const { presupuesto, gasto } = presupuestoUsuario;
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = gasto;
    }

    mensaje(mensaje, tipo) {
        const divMensaje = document.createElement('div');


        if (tipo === 'error') {
            divMensaje.classList.add('alert', 'alert-danger');
        } else {
            divMensaje.classList.add('alert', 'alert-success');
        }

        divMensaje.textContent = mensaje;
        const contenido = document.querySelector('.primario');
        contenido.insertBefore(divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);

    }

    listado(gasto) {
        this.limpiarHTML();
        gasto.forEach(gastos => {
            const { nombre, cantidad, id } = gastos;
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.dataset.id = id

            li.innerHTML = `

         ${nombre}  
         <span class="badge badge-primary badge-pill">$${cantidad}</span>
         
         `;

            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            
            btnBorrar.textContent = 'Eliminar';

            li.appendChild(btnBorrar);
            gastosListado.appendChild(li);

        });



    }

    limpiarHTML() {
        while (gastosListado.firstChild) {
            gastosListado.removeChild(gastosListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('span#restante').textContent = restante;
    }

    comprobarRestante(restanteOBJ) {
        const { presupuesto, gasto } = restanteOBJ;
        const restanteDiv = document.querySelector('.restante');

        if ((presupuesto / 4) > gasto) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) > gasto) {
            restanteDiv.classList.remove('alert-success', 'alert-danger');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }


        if (gasto <= 0) {
            ui.mensaje('Su presupuesto esta agotado', 'error');

            document.querySelector('button[type="submit"]').disabled = true;
        }
    }

}

const ui = new UI();
let presupuesto;
//FUNCIONES


function cargarPregunta() {
    const presupuestoUsuario = prompt('Ingrese su presupuesto');


    if (presupuestoUsuario === '' || isNaN(presupuestoUsuario) || presupuestoUsuario < 1) {
        window.location.reload();
    }
    //MANDAR PRESUPUESTO 

    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.incertarPresupuesto(presupuesto);


}


function enviarGasto(e) {
    e.preventDefault();
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if (nombre === '' || isNaN(cantidad) || cantidad < 1) {
        ui.mensaje('Gasto incorrecto', 'error');


    }

    ui.mensaje('El gasto se agrego correctamente', 'correcto');
    const listaPresupuesto = { nombre, cantidad, id: Date.now() }

    presupuesto.nuevoGasto(listaPresupuesto);


    const { gasto } = presupuesto;

    ui.actualizarRestante(gasto);
    ui.listado(presupuesto.gastos);
   

    ui.comprobarRestante(presupuesto);

    //RESETEAR FORMULARIO

    formulario.reset();
}


 function borrarGasto(e){
     if(e.target.classList.contains('borrar-gasto')){
         const {id} = e.target.parentElement.dataset;
         presupuesto.eliminarGasto(id);

         ui.comprobarRestante(presupuesto);

         const {gasto} = presupuesto;

         ui.actualizarRestante(gasto);


         
     }
    

 }