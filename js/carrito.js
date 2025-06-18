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

function eliminarCarrito(elemento, id_vuelo) {
    let carrito = JSON.parse(localStorage.getItem("carrito"))
    elemento.target.parentElement.remove()

    let indiceVuelo = carrito.indexOf(id_vuelo)
    carrito.splice(indiceVuelo, 1)
    localStorage.setItem("carrito", JSON.stringify(carrito))
}


window.addEventListener('DOMContentLoaded', () => {
    let contenedorCarrito = document.querySelector("#cart-items")
    if (contenedorCarrito == undefined) {
        console.log("No es pagina carrito")
        return
    }

    let carrito = JSON.parse(localStorage.getItem("carrito"))

    carrito.forEach(async (idVuelo) => {
        let vuelo = await obtenerDestino(idVuelo)
        contenedorCarrito.innerHTML += vuelo
    });
});
