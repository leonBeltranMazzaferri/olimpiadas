async function renderizarLista(contenedor, data, campos, boton) {
    data?.forEach(element => {
        let divPadre = document.createElement('div')
        divPadre.className = "paquete-card"

        campos.forEach(campo => {
            let textoHijo = document.createElement('p')
            textoHijo.innerHTML = campo == "fecha_compra" ? element[campo].replace(/t.*/i, '') : element[campo]
            textoHijo.className = campo
            divPadre.append(textoHijo)
        })

        if (boton != undefined) {
            let botonCarrito = document.createElement("button")
            let funcionCarrito = boton ? "agregarCarrito(" : "eliminarCarrito("
            funcionCarrito += divPadre.querySelector(".id_paquete").innerHTML + ")"
            botonCarrito.setAttribute("onclick", funcionCarrito)
            botonCarrito.innerHTML = boton ? "Agregar" : "Quitar"
            divPadre.append(botonCarrito)
        }
        contenedor.append(divPadre)
    })
}

async function cargarPaquetes() {
    const contenedor = document.getElementById('carousel');
    const response = await fetch('http://localhost:3000/api/paquetes');
    const data = await response.json();
    await renderizarLista(contenedor, data, [
        "id_paquete",
        "nombre",
        "descripcion",
        "destino",
        "precio"
    ], true);
}