if (localStorage.getItem("carrito") == undefined) {
    localStorage.setItem("carrito", JSON.stringify([]))
}

async function comprobarCuenta() {
    let autenticado
    await fetch('http://localhost:3000/api/protected', {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        if (data.user) {
            autenticado = true
        } else {
            autenticado = false
        }}
    )
    .catch(() => {
        // Si hay error, asume que no está autenticado
        document.getElementById('login-link').style.display = '';
        document.getElementById('user-link').style.display = 'none';
    });
    return autenticado
}

async function agregarCarrito(id_paquete) {
    let carrito = JSON.parse(localStorage.getItem("carrito"))

    if(! await comprobarCuenta()) {
        alert("Para realizar esta accion se necesita una cuenta!")
        return
    }
    if(carrito.includes(id_paquete)){
        alert("Este vuelo ya esta en el carrito!")
        return
    }

    carrito.push(id_paquete)
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

async function eliminarCarrito(id_paquete) {
    let carrito = JSON.parse(localStorage.getItem("carrito"))
    let indiceVuelo = carrito.indexOf(id_paquete)
    carrito.splice(indiceVuelo, 1)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    await actualizarCarrito()
}

async function actualizarCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito"))
    const contenedor = document.getElementById('cart-items')
    contenedor.innerHTML = ""

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

async function sumarPecios() {
    let carrito = JSON.parse(localStorage.getItem("carrito"));
    const response = await fetch('http://localhost:3000/api/ObtenerPrecios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: carrito })
    });
    const data = await response.json();
    console.log("Total del carrito:", data.total);
    return data.total;
}

async function crearPreferencia() {
    let carrito = JSON.parse(localStorage.getItem("carrito"));
    if (carrito.length == 0) {
        alert("El carrito está vacío, no se puede crear una preferencia de pago.")
        return
    }
    const total = await sumarPecios();
    const response = await fetch('http://localhost:3000/api/crearPreferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre: "Compra de paquetes",
            precio: total
        })
    })
    console.log("Preferencia creada con éxito:", response);
    const data = await response.json();
    window.location.href = data.init_point;
}

window.addEventListener('DOMContentLoaded', async () => {
    let contenedorCarrito = document.querySelector("#cart-items")
    if (contenedorCarrito == undefined) {
        console.log("No es pagina carrito")
        return
    }

    await actualizarCarrito()
});