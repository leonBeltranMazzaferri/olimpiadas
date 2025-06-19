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

async function cargarLista() {
    const listaProductos = document.querySelector("#listaProductos")
    listaProductos.innerHTML = ''
    const response = await fetch('http://localhost:3000/api/obtenerProductos')
    const data = await response.json()
    
    data?.forEach(element => {
        let divPadre = document.createElement('div')
        divPadre.className = "producto"

        let codigoProd = document.createElement('p')
        let nombre = document.createElement('p')
        let descripcion = document.createElement('p') 
        let destino = document.createElement('p')
        let precioUnitario = document.createElement('p')

        codigoProd.innerHTML = element.id_paquete
        nombre.innerHTML = element.nombre
        descripcion.innerHTML = element.descripcion
        destino.innerHTML = element.destino
        precioUnitario.innerHTML = element.precio
        
        divPadre.append(codigoProd, nombre, descripcion, destino, precioUnitario)
        listaProductos.append(divPadre)
    })
}

async function cargarPendientes() {
    const listaPendientes = document.querySelector("#listaPendientes")
    listaPendientes.innerHTML = ''
    const response = await fetch('http://localhost:3000/api/obtenerPendientes')
    const data = await response.json()
    
    data?.forEach(element => {
        let divPadre = document.createElement('div')
        divPadre.className = "producto"

        let idCompra = document.createElement('p')
        let idUsuario = document.createElement('p')
        let idPaquete = document.createElement('p') 
        let fechaCompra = document.createElement('p')
        let estado = document.createElement('p')
        let botonAnular = document.createElement('button')
        let botonEntregar = document.createElement('button')


        idCompra.innerHTML = element.id_compra
        idUsuario.innerHTML = element.id_usuario
        idPaquete.innerHTML = element.id_paquete
        fechaCompra.innerHTML = element.fecha_compra.replace(/t.*/i, '');
        estado.innerHTML = element.estado

        botonAnular.innerHTML = "Anular pedido"
        botonAnular.setAttribute("onclick",`cambiarEstado(${element.id_compra}, "Anulado")`)

        botonEntregar.innerHTML = "Entregar pedido"
        botonEntregar.setAttribute("onclick",`cambiarEstado(${element.id_compra}, "Entregado")`)
        
        divPadre.append(idCompra, idUsuario, idPaquete, fechaCompra, estado, botonEntregar, botonAnular)
        listaPendientes.append(divPadre)
    })
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
}