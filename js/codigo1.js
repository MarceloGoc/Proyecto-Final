document.getElementById("boton1").addEventListener("click", function() {
    let camposRequeridos = ["nombre", "mail", "fecha", "dir"];
    let camposCompletos = camposRequeridos.every(function(id) {
        return document.getElementById(id).value.trim() !== "";
    });
    
    if (camposCompletos) {
        Swal.fire({
            title: "Quieres guardar los cambios?",
            showDenyButton: true,
            confirmButtonText: "Guardar",
            denyButtonText: `Volver`
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire("Guardado!", "", "success");
              RegistrarDatos();
            } else if (result.isDenied) {
            }
          });
    } else {
        footerMensaje(`Todos los campos son requeridos`);
    }
});
document.getElementById("boton2").addEventListener("click",function(){
    ultimaVenta()
});
document.getElementById("fecha").valueAsDate = new Date();

let actividades = [];
let cambioRegistro = false;
let datos = {};

let registroProductos = [];
let error1 = `<span class="material-symbols-outlined">warning</span><br>
<b>Todos los campos son requeridos</b>`
let error2 = `<span class="material-symbols-outlined">warning</span><br>
<b>Todos los campos son requeridos</b>`
let footerError = document.getElementById("error");
let errorCampos = document.createElement("div");

fetch("../db/data.json")
    .then(response => response.json())
    .then(data => {
        actividades = data;
    });
    
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
        }, 
        
        3000);
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
    parrafo2.innerHTML = `<ul><li><span class="verde">Bocas de Cable TV:<span> Es el servicio clásico con 80 canales. Solo puede haber un máximo de 5 por domicilio</li><br>
    <li><span class="verde">Decos clásico HD y Smart 4k:<span> Debe haber una boca de cable por cada decodificador para poder cargarlos.<br>
    Se pueden convinar a pedido del cliente.</li><br>    
    <li><span class="verde">Cable módem de internet 100 o 300 MB:<span> Solo se puede elegir un servicio por domicilio 100 o 300 MB</li></ul>
    <p>El sistema no va a dejarte cargar actividades fuera de esos parámetros. Es importante que acuerdes con el cliente </p>`
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
    document.getElementById("sumButton").addEventListener("click", async function() {  
        let actividadAgregada = false;
        document.querySelectorAll('.counter').forEach(function(counter) {
            if (parseInt(counter.innerText) > 0) {
                actividadAgregada = true;
            }
        });
     
        if (actividadAgregada) {
            Swal.fire({
                title: "Quieres guardar los cambios?",
                showDenyButton: true,
                confirmButtonText: "Guardar",
                denyButtonText: `Volver`
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire("Guardado!", "", "success");
                  RegistrarDatos2();
                } else if (result.isDenied) {
                }
              });
        } else {
            footerMensaje(`Debes agregar al menos una actividad`);
        }
    });
};