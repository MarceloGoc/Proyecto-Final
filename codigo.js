document.getElementById("boton1").addEventListener("click", function() {
    let camposRequeridos = ["nombre", "mail", "fecha", "dir"];
    let camposCompletos = camposRequeridos.every(function(id) {
        return document.getElementById(id).value.trim() !== "";
    });
    
    if (camposCompletos) {
        RegistrarDatos();
    } else {
        footerMensaje(`Todos los campos son requeridos`);
    }
});
document.getElementById("boton2").addEventListener("click",function(){
    ultimaVenta()
});

const actividades = [
    {   
        id: "1",
        producto: "Boca de Cable TV",
        precio: 500
    },
    {   
        id: "2",
        producto: "Deco clasico HD ",
        precio: 250
    },
    {   
        id: "3",
        producto: "Deco Smart TV 4K",
        precio: 650
    },
    {   
        id: "4",
        producto: "Internet 100 MB ",
        precio: 750
    },
    {   
        id: "5",
        producto: "Internet 300 MB ",
        precio: 1000
    }
];

let cambioRegistro = false;
let datos = {};
let ventas = [];
let registroProductos = [];
let error1 = `<span class="material-symbols-outlined">warning</span><br>
<b>Todos los campos son requeridos</b>`
let error2 = `<span class="material-symbols-outlined">warning</span><br>
<b>Todos los campos son requeridos</b>`
let footerError = document.getElementById("error");
let errorCampos = document.createElement("div");

function footerMensaje (mensaje) {
    if (footerError.contains(errorCampos)) {
        errorCampos.innerHTML = `<span class="material-symbols-outlined">warning</span><br>
                                <p>${mensaje}</p>`;
    } else {
        errorCampos.innerHTML = `<span class="material-symbols-outlined">warning</span><br>
                                <p>${mensaje}</p>`;
        footerError.appendChild(errorCampos);
        setTimeout(()=>{
        footerError.removeChild(errorCampos);
        }, 3000);
    };

};

function RegistrarDatos(){
    let nombre = document.getElementById("nombre").value;
    let mail = document.getElementById("mail").value;
    let fecha = document.getElementById("fecha").value;
    let direccion = document.getElementById("dir").value;
    
    datos = {
        nombre: nombre,
        mail: mail,
        fecha: fecha,
        direccion: direccion
    };
    
    const p1 = document.getElementById("p1");
    const div1 = document.getElementById("div1");
    const h3 =document.getElementById("h3");
    h3.remove();
    p1.remove();
    div1.remove();
    cambioRegistro = true;
    if (cambioRegistro) {
        nuevaTabla();
    }
}
let parrafo2 = document.getElementById("p2");
let registroActividades = document.getElementById("div2");
let total = document.createElement("div");
total.className = "divTotal";
total.innerHTML = `<label>Costo mensual del servicio: </label><input type="number" id="totalIn" readonly></input>`;
let summitCont = document.createElement("div");
summitCont.className = "SumButton";
summitCont.innerHTML = `<button id="sumButton">Registrar</button>`;

function nuevaTabla() {
    parrafo2.innerHTML = `<li><span class="verde">Bocas de Cable TV:<span> Es el servicio clasico con 80 canales. Solo puede haber un maximo de 5 por domicilio</li><br>
    <li><span class="verde">Decos clasico HD y Smart 4k:<span> Debe haber una boca de cable por cada decodificador para poder cargarlos.<br>
    Se pueden convinar a pedido del cliente.</li><br>    
    <li><span class="verde">Cable modem de internet 100 o 300 MB:<span> Solo se puede elegir un servicio por domicilio 100 o 300 MB</li>
    <p>El sistema no va a dejarte cargar actividades fuera de esos parametros. Es importante que acuerdes con el cliente </p>`
    actividades.forEach((actividad) => {
        let contenedor = document.createElement("div");
        contenedor.className = "Form2";
        let precio= actividad.precio;
        let contInicial = 0;
        let totalInic = precio * contInicial;
        contenedor.innerHTML = `<label>${actividad.producto}</label>
                                    <button class="boton-minus" data-id="${actividad.id}">-</button>
                                    <span class="counter" data-id="${actividad.id}" readonly>0</span>
                                    <button class="boton-plus" data-id="${actividad.id}">+</button>
                                    <input class="parcial" data-id="${actividad.id}" value="${totalInic}" readonly></input>`;
        registroActividades.className = "container2"
        registroActividades.appendChild(contenedor);
    });
    
    let sumas = document.querySelectorAll('.boton-plus');
    let restas = document.querySelectorAll('.boton-minus');
    let counters = document.querySelectorAll('.counter');
    let precios = actividades.map(actividad => actividad.precio);
    let cantidades = Array.from(counters).map(() => 0); 
    
    sumas.forEach((button, index) => {
        button.onclick = () => {
            let id = button.getAttribute('data-id');
            let counter = counters[index];
            switch (id) {
                case "1":
                    if (cantidades[0] >= 5) {
                        return; 
                    }
                    break;
                case "2":
                case "3":
                    if (cantidades[0] <= cantidades[1] + cantidades[2]) {
                        return; 
                    }
                    break;
                case "4":
                case "5":
                    if (cantidades[3] + cantidades[4] >= 1) {
                        return; 
                    }
                    break;
            }
            cantidades[id - 1]++;
            counter.innerText = cantidades[id - 1];
            actualizarTotal(id);
        };
    });
    
    restas.forEach((button, index) => {
        button.onclick = () => {
            let id = button.getAttribute('data-id');
            let counter = counters[index];
            if (cantidades[id - 1] > 0) {
                cantidades[id - 1]--;
                counter.innerText = cantidades[id - 1];
                actualizarTotal(id);
            }
        };
    });

    function actualizarTotal(id) {
        let counter = document.querySelector(`.counter[data-id="${id}"]`);
        let cantidad = parseInt(counter.innerText);
        let precio = precios[id - 1];
        let total = cantidad * precio;
        let inputParcial = document.querySelector(`.parcial[data-id="${id}"]`);
        inputParcial.value = total;
        let sumaTotal = 0;
        document.querySelectorAll(`.parcial`).forEach(input =>{
            sumaTotal += parseInt(input.value) || 0;
        });
        document.getElementById(`totalIn`).value = sumaTotal;
    }
    
    registroActividades.appendChild(total);
    registroActividades.appendChild(summitCont);
    document.getElementById("sumButton").addEventListener("click", function() {  
        let actividadAgregada = false;
        document.querySelectorAll('.counter').forEach(function(counter) {
            if (parseInt(counter.innerText) > 0) {
                actividadAgregada = true;
            }
        });
     
        if (actividadAgregada) {
            RegistrarDatos2();
        } else {
            footerMensaje(`Debes agregar al menos una actividad`);
        }
    });
};

let cambioRegistro2 = false;
let totalValue = 0;
function RegistrarDatos2(){
    totalValue = document.getElementById("totalIn").value;
    const div2 = document.getElementById("div2");
    const p2 = document.getElementById("p2");
    guardarDatos();   
    p2.remove();
    div2.remove();
    cambioRegistro2 = true;
    if (cambioRegistro2) {  
        nuevaTabla2();
    };
    let ventas = JSON.parse(localStorage.getItem('ventas')) || [];
function guardarVenta() {
    const venta = {
        datos: datos,
        productos: registroProductos,
        total: totalValue
    };
    ventas.push(venta);
    localStorage.setItem("ventas", JSON.stringify(ventas));
    registroProductos = [];
}
guardarVenta();
};


function guardarDatos() {
    registroProductos = [];
    actividades.forEach((actividad) => {
        let id = actividad.id;
        let producto = actividad.producto;
        let contador = document.querySelector(`.counter[data-id="${id}"]`).innerText;
        let precio = actividad.precio;
        let total = contador * precio;
        registroProductos.push({
            id: id,
            producto: producto,
            cantidad: contador,
            precio: precio,
            total: total
        });
        
    });
}

function nuevaTabla2(){

    let registroActividades2 = document.getElementById("div3");
    let h2 = document.createElement("h2")
    let contenidoH2 = `Resumen de productos`
    let registroFinal= document.createElement("div");
    registroFinal.className = "divFinal";
    let contenido = `
                     <p>En la fecha ${datos.fecha} se genera un pedido de instalación 
                     a nombre de ${datos.nombre}, con domicilio en ${datos.direccion}. 
                     El mismo consta de: </p><br>`;

    registroProductos.forEach((producto) => {
        if (producto.cantidad > 0) {contenido += `<br><li class="lista"> ${producto.cantidad} ${producto.producto} por un parcial de $${producto.total}</li>`;
        };
    });


    contenido += `<br><br><p>El costo mensual del servicio será de: $ ${totalValue}</p>
    <button class="reiniciar" id="reiniciar">Ir al inicio</button>`;
    registroFinal.innerHTML = contenido;
    h2.innerHTML = contenidoH2
    registroActividades2.appendChild(h2)
    registroActividades2.appendChild(registroFinal);
    let reinicio = document.getElementById("reiniciar");
    reinicio.onclick = () => {
        location.reload();
    };
};

let indiceVentaActual = 0;

function ultimaVenta() {
    let pElement = document.querySelector('body > p');
    if (pElement) {
    pElement.remove();
}
    while (div2.firstChild) {
        div2.removeChild(div2.firstChild);
    }
    while (div1.firstChild) {
        div1.removeChild(div1.firstChild);
    }

    let ventasGuardadas = localStorage.getItem('ventas');
    let ventas = JSON.parse(ventasGuardadas);
    if (!ventas || ventas.length === 0) {
        div2.innerHTML = `<h3>No hay ventas guardadas</h3><br><br>`;
    } else {
        let venta = ventas[indiceVentaActual];
        let contenedor = document.createElement("div");
        contenedor.className = "uVenta";
        contenedor.innerHTML = `
            <h3>Venta ${indiceVentaActual + 1}</h3>
            <p>En la fecha ${venta.datos.fecha} se generó una venta a nombre de ${venta.datos.nombre}, con domicilio en ${venta.datos.direccion}. El mismo consta de:</p>`;
        venta.productos.forEach((producto) => {
            if (producto.cantidad > 0) {
                contenedor.innerHTML += `<li>${producto.cantidad} ${producto.producto} por un total de $${producto.total}</li>`;
            }
        });
        contenedor.innerHTML += `<p>El costo mensual del servicio será de: $ ${venta.total}</p>`;
        contenedor.innerHTML += `<button class="borrarVenta" data-index="${indiceVentaActual}">Borrar venta</button>`;
        let botonesBorrar = contenedor.querySelectorAll('.borrarVenta');
        botonesBorrar.forEach((boton) => {
            boton.addEventListener('click', function() {
                let index = this.getAttribute('data-index');
                ventas.splice(index, 1);
                localStorage.setItem('ventas', JSON.stringify(ventas));
                indiceVentaActual = 0; 
                ultimaVenta(); 
            });
        });
        div2.appendChild(contenedor);
        if (indiceVentaActual > 0) {
            let botonAnterior = document.createElement("button");
            botonAnterior.textContent = "Anterior";
            botonAnterior.addEventListener("click", function() {
                indiceVentaActual--;
                ultimaVenta();
            });
            div2.appendChild(botonAnterior);
        }
        if (indiceVentaActual < ventas.length - 1) {
            let botonSiguiente = document.createElement("button");
            botonSiguiente.textContent = "Siguiente";
            botonSiguiente.addEventListener("click", function() {
                indiceVentaActual++;
                ultimaVenta();
            });
            div2.appendChild(botonSiguiente);
        }
    }
    let botonInicio = document.createElement("button");
    botonInicio.textContent = "Ir al inicio";
    botonInicio.addEventListener("click", function() {
        location.reload();
    });
    div2.appendChild(botonInicio);
};





