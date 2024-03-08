
let nombre = prompt("ingrese su nombre");
let empresa = prompt("ingrese la empresa");
let fecha = prompt("ingrese la fecha");
let totalActividad = [];
let precioActividad = [];
let continuar = true
let resultado = {
    nombre: nombre,
    empresa: empresa,
    fecha: fecha,
    totalActividad: totalActividad,
    precioActividad: precioActividad,
   };
let total = 0

while (continuar) {
    let actividades = parseInt(prompt("ingrese actividad:\n1 Acometida, 2 Boca catv, 3 Deco HD, 4 Modem WiFi, 5 salir"));
    switch (actividades){
        case 1:
        totalActividad.push("Acometida")
        precioActividad.push(1000)
        break

        case 2:
        totalActividad.push("Boca catv")
        precioActividad.push(700)
        break

        case 3:
        totalActividad.push("Deco HD")
        precioActividad.push(2500)
        break

        case 4: 
        totalActividad.push("Modem WiFi")
        precioActividad.push(3000)
        break

        default:
         alert("Opción inválida")
    }

    let confirmacion = prompt("Desea agregar otra actividad? (si/no)").toLowerCase()
    if (confirmacion == "no") {
        continuar = false
        for (const i of precioActividad) {
            total += i
        }
        console.log(resultado)
        console.log(" El precio Total es de $"+total)
    }
}







