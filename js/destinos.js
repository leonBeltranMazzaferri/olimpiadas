async function cargarDestinos(cantidad) {
    try {
        const response = await fetch(`http://localhost:3000/vuelos?cantidad=${cantidad}`);
        const destinos = await response.json();

        const destinosDiv = document.getElementById('destinos');
        if (!destinosDiv) return;

        const btnIzq = `<button class="carousel-btn left" onclick="scrollDestinos(-1)">❮</button>`;
        const btnDer = `<button class="carousel-btn right" onclick="scrollDestinos(1)">❯</button>`;

        const destinosHTML = destinos.map(destino => `
            <div class="destino-item">
            <h3>${destino.origen} → ${destino.destino}</h3>
            <p>Vuelo: ${destino.codigo_vuelo}</p>
            <p>Salida: ${destino.hora_salida} - Llegada: ${destino.hora_llegada}</p>
            <p>Precio: $${destino.precio}</p>
            </div>
        `).join('');

        destinosDiv.innerHTML = btnIzq + destinosHTML + btnDer;
    } catch (error) {
        console.error('Error al cargar destinos:', error);
    }
}

window.addEventListener('DOMContentLoaded', cargarDestinos(10));
