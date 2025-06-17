async function cargarDestinos(cantidad) {
    try {
        const response = await fetch(`http://localhost:3000/vuelos?cantidad=${cantidad}`);
        const destinos = await response.json();

        const destinosDiv = document.querySelector('#carousel');
        if (!destinosDiv) return;

        const destinosHTML = destinos.map(destino => `
            <div class="destino-item">
            <h3>${destino.origen} → ${destino.destino}</h3>
            <p>Vuelo: ${destino.codigo_vuelo}</p>
            <p>Salida: ${destino.hora_salida} - Llegada: ${destino.hora_llegada}</p>
            <p>Precio: $${destino.precio}</p>
            <button onclick="agregarCarrito(${destino.id_vuelo})">Agregar al carrito</button>
            </div>
        `).join('');

        destinosDiv.innerHTML = destinosHTML;
    } catch (error) {
        console.error('Error al cargar destinos:', error);
    }
}

async function obtenerDestino(idVuelo) {
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

window.addEventListener('DOMContentLoaded', cargarDestinos(10));
