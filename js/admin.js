async function agregarProd(event) {
    event.preventDefault();
    let respuestaHTML = document.querySelector("#respAgregarProd")
    const formData = new FormData(event.target)
    const nombre = formData.get("nombre")
    const descripcion = formData.get("descripcion")
    const precioUnitario = formData.get("precioUnitario")
    const destino = formData.get("destino")

    const response = await fetch('http://localhost:3000/api/agregarProducto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre,
            destino,
            descripcion,
            precioUnitario
        })
    })

    const data = await response.json();
    respuestaHTML.innerHTML = data.message || data.error
    respuestaHTML.style.color = response.ok ? 'green' : 'red'
    respuestaHTML.style.display = "block" 

    cargarLista()
}

async function renderizarLista(contenedor, data, campos) {
    contenedor.innerHTML = ''

    data?.forEach(element => {
        let divPadre = document.createElement('div')
        divPadre.className = "entradaLista"

        campos.forEach(campo => {
            let textoHijo = document.createElement('p')
            textoHijo.innerHTML = campo == "fecha_compra" ? element[campo].replace(/t.*/i, '') : element[campo]
            textoHijo.className = campo
            divPadre.append(textoHijo)
        })

        contenedor.append(divPadre)
    })
}

async function cargarLista() {
    const listaProductos = document.querySelector("#listaProductos")
    const response = await fetch('http://localhost:3000/api/obtenerProductos')
    const data = await response.json()

    await renderizarLista(listaProductos, data, [
        "id_paquete",
        "nombre",
        "descripcion",
        "destino",
        'precio'
    ])
}

async function cargarPendientes() {
    const listaPendientes = document.querySelector("#listaPendientes")
    listaPendientes.innerHTML = ''
    const response = await fetch('http://localhost:3000/api/obtenerPendientes')
    const data = await response.json()

    await renderizarLista(listaPendientes, data, [
        "id_compra",
        "id_usuario",
        "id_paquete",
        "fecha_compra",
        'estado'
    ])

    listaPendientes.childNodes.forEach(pendiente => {
        let botonAnular = document.createElement('button')
        let botonEntregar = document.createElement('button')
        let id_compra = pendiente.querySelector(".id_compra").innerHTML
            
        botonAnular.innerHTML = "Anular pedido"
        botonAnular.setAttribute("onclick",`cambiarEstado(${id_compra}, "Anulado")`)

        botonEntregar.innerHTML = "Entregar pedido"
        botonEntregar.setAttribute("onclick",`cambiarEstado(${id_compra}, "Entregado")`)
            
        pendiente.append(botonAnular, botonEntregar)
    })
}

async function cargarClientes() {
    const listaClientes = document.querySelector("#listaClientes")
    const response = await fetch('http://localhost:3000/api/obtenerClientes')
    const data = await response.json()

    await renderizarLista(listaClientes, data, [
        "id_usuario",
        "nombre",
        "apellido",
        "email",
        'telefono'
    ])

    listaClientes.childNodes.forEach(cliente => {
        cliente.addEventListener("click", () => verPedidos(cliente.querySelector(".id_usuario").innerHTML, listaClientes))
    })
}

async function verPedidos(id_usuario, listaClientes) {
    const response = await fetch(`http://localhost:3000/api/obtenerPedidosCliente?id=${id_usuario}`)
    const data = await response.json()

    await renderizarLista(listaClientes, data, [
        "id_compra",
        "id_usuario",
        "id_paquete",
        "fecha_compra",
        'estado'
    ])

    let botonVolver = document.createElement('button')
    botonVolver.addEventListener('click', () => {
        cargarClientes()
    })

    botonVolver.innerHTML = 'Volver'

    listaClientes.append(botonVolver)

}

async function cambiarEstado(idPedido, nuevoEstado) {
    const response = await fetch(`http://localhost:3000/api/anularPedido?id=${idPedido}&estado=${nuevoEstado}`)
    const data = await response.json();
    alert(data.message || data.error)
    cargarPendientes() 
}

window.onload = async() => {
    cargarLista()
    cargarPendientes()
    cargarClientes()
}