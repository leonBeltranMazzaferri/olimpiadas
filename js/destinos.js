async function renderizarLista(contenedor, data, campos) {
    contenedor.innerHTML = ''

    data?.forEach(element => {
        let divPadre = document.createElement('div')
        divPadre.className = "paquete-card"

        campos.forEach(campo => {
            let textoHijo = document.createElement('p')
            textoHijo.innerHTML = campo == "fecha_compra" ? element[campo].replace(/t.*/i, '') : element[campo]
            textoHijo.className = campo
            divPadre.append(textoHijo)
        })

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
    ]);
}

async function obtenerPaquetes(idVuelo) {
    try {
        const response = await fetch(`http://localhost:3000/vuelo?idVuelo=${idVuelo}`)
        const destino = await response.json();

        const destinoHTML = `
                <div class="destino-item">
                <h3>${destino[0].origen} → ${destino[0].destino}</h3>
                <p>Vuelo: ${destino[0].codigo_vuelo}</p>
                <p>Salida: ${destino[0].hora_salida} - Llegada: ${destino[0].hora_llegada}</p>
                <p>Precio: $${destino[0].precio}</p>
                <button onclick="eliminarCarrito(event, ${destino[0].id_vuelo})">Quitar</button>
                </div>
            `

        return destinoHTML
    } catch (error) {
        console.error('Error al cargar destino:', error);
    }
}

window.addEventListener('DOMContentLoaded', cargarPaquetes());
