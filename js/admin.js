/**
 * Envía el formulario para agregar un nuevo producto (paquete) al backend.
 * Actualiza la lista de productos tras la respuesta.
 */
async function agregarProd(event) {
    event.preventDefault();
    let respuestaHTML = document.querySelector("#respAgregarProd")
    const formData = new FormData(event.target)
    const nombre = formData.get("nombre")
    const descripcion = formData.get("descripcion")
    const precioUnitario = formData.get("precioUnitario")
    const destino = formData.get("destino")

    // Envia los datos al backend
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

/**
 * Renderiza una lista de elementos en el contenedor especificado.
 * @param {HTMLElement} contenedor - Elemento donde se agregan los items
 * @param {Array} data - Datos a mostrar
 * @param {Array} campos - Campos a mostrar de cada elemento
 */
async function renderizarLista(contenedor, data, campos) {
    data?.forEach(element => {
        let divPadre = document.createElement('div')
        divPadre.className = "entradaLista"

        campos.forEach(campo => {
            let textoHijo = document.createElement('p')
            textoHijo.innerHTML = `${campo.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}: ` + (campo == "fecha_compra" ? element[campo].replace(/t.*/i, '') : element[campo])
            textoHijo.className = campo
            divPadre.append(textoHijo)
        })

        contenedor.append(divPadre)
    })
}

/**
 * Carga y muestra la lista de productos (paquetes) desde el backend.
 */
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

/**
 * Carga y muestra la lista de pedidos pendientes.
 * Agrega botones para anular o entregar cada pedido.
 */
async function cargarPendientes() {
    const listaPendientes = document.querySelector("#listaPendientes")
    listaPendientes.innerHTML = ''
    const response = await fetch('http://localhost:3000/api/obtenerPendientes', {
        credentials: "include"
    });
    const data = await response.json()

    await renderizarLista(listaPendientes, data, [
        "id_compra",
        "id_usuario",
        "id_paquete",
        "fecha_compra",
        'estado'
    ])

    // Agrega botones de acción a cada pendiente
    listaPendientes.childNodes.forEach(pendiente => {
        let botonAnular = document.createElement('button')
        let botonEntregar = document.createElement('button')
        let id_compra = pendiente.querySelector(".id_compra").innerHTML
            
        botonAnular.innerHTML = "Anular pedido"
        botonAnular.setAttribute("onclick",`cambiarEstado(${pendiente.querySelector(".id_compra").innerHTML.match(/\d+/)}, "Anulado")`)

        botonEntregar.innerHTML = "Entregar pedido"
        botonEntregar.setAttribute("onclick",`cambiarEstado(${pendiente.querySelector(".id_compra").innerHTML.match(/\d+/)}, "Entregado")`)
            
        pendiente.append(botonAnular, botonEntregar)
    })
}

/**
 * Carga y muestra la lista de clientes.
 * Permite ver los pedidos de cada cliente al hacer clic.
 */
async function cargarClientes() {
    const listaClientes = document.querySelector("#listaClientes")
    const response = await fetch('http://localhost:3000/api/obtenerClientes', {
        credentials: "include"
    });
    const data = await response.json()

    await renderizarLista(listaClientes, data, [
        "id_usuario",
        "nombre",
        "apellido",
        "email",
        'telefono'
    ])

    // Permite ver los pedidos de un cliente al hacer clic
    listaClientes.childNodes.forEach(cliente => {
        cliente.setAttribute("onclick", `verPedidos(${cliente.querySelector(".id_usuario").innerHTML.match(/\d+/)})`)
    })
}

/**
 * Muestra los pedidos de un cliente específico.
 * Permite volver a la lista de clientes.
 */
async function verPedidos(id_usuario) {
    const listaClientes = document.querySelector("#listaClientes")
    const response = await fetch(`http://localhost:3000/api/obtenerPedidosCliente?id=${id_usuario}`, {
        credentials: "include"
    })
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

/**
 * Cambia el estado de un pedido (por ejemplo, a "Anulado" o "Entregado").
 * Recarga la lista de pendientes tras la acción.
 */
async function cambiarEstado(idPedido, nuevoEstado) {
    const response = await fetch(`http://localhost:3000/api/anularPedido?id=${idPedido}&estado=${nuevoEstado}`)
    const data = await response.json();
    alert(data.message || data.error)
    cargarPendientes() 
}

// Al cargar la página, inicializa las listas de productos, pendientes y clientes
window.onload = async() => {
    cargarLista()
    cargarPendientes()
    cargarClientes()
}