document.getElementById("boton1").addEventListener("click", function(){
    RegistrarDatos()
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
    localStorage.setItem('datos',JSON.stringify(datos));
    const p1 = document.getElementById("p1");
    const div1 = document.getElementById("div1");
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
total.innerHTML = `<label>Costo mensual del servicio: </label><input type="number" id="totalIn"></input>`;
let summitCont = document.createElement("div");
summitCont.className = "SumButton";
summitCont.innerHTML = `<button id="sumButton">Registrar</button>`;

function nuevaTabla() {
    parrafo2.innerHTML = `<p>Bocas de Cable TV: Es el servicio clasico con 80 canales. Solo puede haber un maximo de 5 por domicilio <br><br>
    Decos clasico HD y Smart 4k: Debe haber una boca de cable por cada decodificador para poder cargarlos.<br>
    Se pueden convinar a pedido del cliente. <br><br>
    Cable modem de internet 100 o 300 MB:Solo se puede elegir un servicio por domicilio 100 o 300 MB<br><br>
    El sistema no va a dejarte cargar actividades fuera de esos parametros. Es importante que acuerdes con el cliente </p>`
    actividades.forEach((actividad) => {
        let contenedor = document.createElement("div");
        contenedor.className = "Form2";
        let precio= actividad.precio;
        let contInicial = 0;
        let totalInic = precio * contInicial;
        contenedor.innerHTML = `<label>${actividad.producto}</label>
                                    <button class="boton-minus" data-id="${actividad.id}">-</button>
                                    <span class="counter" data-id="${actividad.id}">0</span>
                                    <button class="boton-plus" data-id="${actividad.id}">+</button>
                                    <input class="parcial" data-id="${actividad.id}" value="${totalInic}"></input>`;
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
    document.getElementById("sumButton").addEventListener("click", function(){
        RegistrarDatos2();
    });
}

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
    }
}

let registroProductos = [];

function guardarDatos() {
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
        localStorage.setItem("registroProductos", JSON.stringify(registroProductos));
    });
}

function nuevaTabla2(){

    let registroActividades2 = document.getElementById("div3");
    let registroFinal= document.createElement("div");
    registroFinal.className = "divFinal";
    let contenido = `<h2>Resumen de productos</h2>
                     <p>En la fecha ${datos.fecha} se genera un pedido de instalación 
                     a nombre de ${datos.nombre}, con domicilio en ${datos.direccion}. 
                     El mismo consta de:`;

    registroProductos.forEach((producto) => {
        if (producto.cantidad > 0) {contenido += `<br>- ${producto.cantidad} ${producto.producto} por un parcial de $${producto.total}`;
        };
    });


    contenido += `.</p>`;
    registroFinal.innerHTML = contenido;
    registroFinal.innerHTML += `<p>El costo mensual del servicio será de: $ ${totalValue}</p>
                            <button class="reiniciar" id="reiniciar">Ir al inicio</button>`
    registroActividades2.appendChild(registroFinal);
    let reinicio = document.getElementById("reiniciar");
    reinicio.onclick = () => {
        location.reload();
    };
};

function ultimaVenta() {
    p1.remove();
    div1.remove();
    let pVenta = document.getElementById("div2");
    let contenedor = document.createElement("div");
    let datosGuardados = localStorage.getItem(`datos`);
    let datos = JSON.parse(datosGuardados);
    let productosGuardados = localStorage.getItem(`registroProductos`);
    let registroProductos = JSON.parse(productosGuardados);
    let totalSum = 0; 

    contenedor.innerHTML = `<h2>Resumen de productos</h2>
    <p>En la fecha ${datos.fecha} se genera un pedido de instalación 
    a nombre de ${datos.nombre}, con domicilio en ${datos.direccion}. 
    El mismo consta de:`;

    registroProductos.forEach((producto) => {
        if (producto.cantidad > 0) {
            contenedor.innerHTML += `<br>- ${producto.cantidad} ${producto.producto} por un parcial de $${producto.total}`;
            totalSum += producto.total; 
        }
     });

    contenedor.innerHTML += `.</p>`;
    contenedor.innerHTML += `<p>El costo mensual del servicio será de: $ ${totalSum}</p>
                             <button class= "Reiniciar" id="reiniciar">Ir al inicio</button> `;
    pVenta.appendChild(contenedor);
    let reinicio = document.getElementById("reiniciar");
    reinicio.onclick = () => {
        location.reload();
    };
};




