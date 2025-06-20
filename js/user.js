/**
 * Al cargar la página de usuario, verifica si el usuario está autenticado.
 * Muestra un mensaje de bienvenida o error según corresponda.
 * Además, diferencia si es admin o cliente.
 */

async function cancelarPedido(idCliente, idPedido) {
    const response = await fetch(`http://localhost:3000/api/cancelarPedido?id=${idPedido}`)
    const data = await response.json();
    alert(data.message || data.error)
    cargarPaquetes(idCliente) 
}

async function renderizarLista(contenedor, data, campos, idCliente) {
    data?.forEach(element => {
        let divPadre = document.createElement('li');
        divPadre.className = "card";

        campos.forEach(campo => {
            let textoHijo = document.createElement('p')
            textoHijo.innerHTML = `${campo.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}: ` + (campo == "fecha_compra" ? element[campo].replace(/t.*/i, '') : element[campo])
            textoHijo.className = campo
            divPadre.append(textoHijo)
        })

        if (divPadre.querySelector(".estado").innerHTML == "Estado: Pendiente") {
            let botonCancelar = document.createElement("button")
            botonCancelar.innerHTML = "Cancelar pedido"
            botonCancelar.setAttribute("onclick", `cancelarPedido(${idCliente}, ${divPadre.querySelector(".id_compra").innerHTML.match(/\d+/)})`)
            divPadre.append(botonCancelar)
        }
        contenedor.append(divPadre)
    })
}

async function cargarPaquetes(id) {
    const contenedor = document.getElementById('pedidos');
    contenedor.innerHTML = ""
    const response = await fetch(`http://localhost:3000/api/clientePedidos?id=${id}`);
    const data = await response.json();
    await renderizarLista(contenedor, data, [
        "id_compra",
        "nombre_paquete",
        "precio_paquete",
        "fecha_compra",
        "estado"
    ], id);
}

document.addEventListener('DOMContentLoaded', async function() {
    await fetch('http://localhost:3000/api/protected', {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(async data => {
        const mensajeDiv = document.getElementById('mensaje');
        if (data.user) {
            mensajeDiv.style.color = "#12B1D1";
            mensajeDiv.textContent = "Bienvenido, " + (data.user.username || data.user.email) +"!";
            await cargarPaquetes(data.user.id_usuario)
        } else {
            mensajeDiv.style.color = "red";
            mensajeDiv.textContent = "No autorizado o token inválido";
        }
    })
    .catch(err => {
        const mensajeDiv = document.getElementById('mensaje');
        mensajeDiv.style.color = "red";
        mensajeDiv.textContent = "Error al comprobar autenticación";
    });
});