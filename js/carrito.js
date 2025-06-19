if (localStorage.getItem("carrito") == undefined) {
    localStorage.setItem("carrito", JSON.stringify([]))
}

function agregarCarrito(id_vuelo) {
    let carrito = JSON.parse(localStorage.getItem("carrito"))

    if(carrito.includes(id_vuelo)){
        alert("Este vuelo ya esta en el carrito!")
        return
    }

    carrito.push(id_vuelo)
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

async function eliminarCarrito(id_vuelo) {
    let carrito = JSON.parse(localStorage.getItem("carrito"))
    let indiceVuelo = carrito.indexOf(id_vuelo)
    carrito.splice(indiceVuelo, 1)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    await actualizarCarrito()
}

async function actualizarCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito"))
    const contenedor = document.getElementById('cart-items')
    if (carrito.length == 0) {
        contenedor.innerHTML = ""
        return
    }

    carrito.forEach(async id_paquete => {
        const response = await fetch(`http://localhost:3000/api/paquete?id=${id_paquete}`);
        const data = await response.json();
        await renderizarLista(contenedor, data, [
            "id_paquete",
            "nombre",
            "descripcion",
            "destino",
            "precio"
        ], false);        
    })
}

window.addEventListener('DOMContentLoaded', async () => {
    let contenedorCarrito = document.querySelector("#cart-items")
    if (contenedorCarrito == undefined) {
        console.log("No es pagina carrito")
        return
    }

    await actualizarCarrito()
});
