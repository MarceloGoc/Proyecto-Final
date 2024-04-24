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
                     El mismo consta de: </p><ul>`;

    registroProductos.forEach((producto) => {
        if (producto.cantidad > 0) {contenido += `<br><li class="lista"> ${producto.cantidad} ${producto.producto} por un parcial de $${producto.total}</li>`;
        };
    });


    contenido += `</ul><br><p>El costo mensual del servicio será de: $ ${totalValue}</p>
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
            <p>En la fecha ${venta.datos.fecha} se generó una venta a nombre de ${venta.datos.nombre}, con domicilio en ${venta.datos.direccion}. El mismo consta de:</p><ul>`;
        venta.productos.forEach((producto) => {
            if (producto.cantidad > 0) {
                contenedor.innerHTML += `<li>${producto.cantidad} ${producto.producto} por un parcial de $${producto.total}</li>`;
            }
        });
        contenedor.innerHTML += `<p>El costo mensual del servicio será de: $ ${venta.total}</p>`;
        contenedor.innerHTML += `<button class="borrarVenta" data-index="${indiceVentaActual}">Borrar venta</button>`;
        contenedor.innerHTML += `<button class="generarPDF" data-index="${indiceVentaActual}">Generar PDF</button>`;
        let botonesBorrar = contenedor.querySelectorAll('.borrarVenta');
        botonesBorrar.forEach((boton) => {
            boton.addEventListener('click', function() {
                let index = this.getAttribute('data-index');
                Swal.fire({
                    title: "¿Quieres borrar la venta?",
                    showDenyButton: true,
                    confirmButtonText: "Borrar",
                    denyButtonText: `Volver`
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire("Borrado!", "", "success");
                        ventas.splice(index, 1);
                        localStorage.setItem('ventas', JSON.stringify(ventas));
                        indiceVentaActual = 0;
                        ultimaVenta();
                    } else if (result.isDenied) {}
                });
            });
        });
        let botonesPDF = contenedor.querySelectorAll('.generarPDF');
        botonesPDF.forEach((boton) => {
            boton.addEventListener('click', function() {
                generarPDF(venta);
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

function generarPDF(venta) {
    var doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Factura", 105, 20, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Fecha: ${venta.datos.fecha}`, 20, 30);
    doc.text(`Cliente: ${venta.datos.nombre}`, 20, 40);
    doc.text(`Domicilio: ${venta.datos.direccion}`, 20, 50);
    let y = 70;
    doc.setFont("helvetica", "bold");
    doc.text("Descripción", 20, y);
    doc.text("Cantidad", 80, y);
    doc.text("Precio unitario", 120, y);
    doc.text("Total", 170, y);
    y += 10;

    venta.productos.forEach((producto) => {
        if (producto.cantidad > 0) {
            doc.setFont("helvetica", "normal");
            doc.text(`${producto.producto}`, 20, y);
            doc.text(`${producto.cantidad}`, 80, y);
            doc.text(`$${producto.precio}`, 120, y);
            doc.text(`$${producto.total}`, 170, y);
            doc.setLineWidth(0.1);
            doc.line(20, y + 2, 190, y + 2);
            
            y += 10;
        }
    });

    doc.setFont("helvetica", "bold");
    doc.text(`Total: $${venta.total}`, 140, y + 10);
    doc.setFontSize(10);
    doc.text("Gracias por su elegirnos", 105, 270, { align: "center" });
    doc.save('factura_venta.pdf');
};
