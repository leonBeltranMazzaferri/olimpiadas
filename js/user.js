/**
 * Al cargar la página de usuario, verifica si el usuario está autenticado.
 * Muestra un mensaje de bienvenida o error según corresponda.
 * Además, diferencia si es admin o cliente.
 */
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/api/protected', {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        const mensajeDiv = document.getElementById('mensaje');
        if (data.user) {
            // Diferencia por el campo rolUser (1 = admin, 0 = cliente)
            if (data.user.rolUser === 1) {
                mensajeDiv.style.color = "#12B1D1";
                mensajeDiv.textContent = "Bienvenido ADMIN, " + (data.user.username || data.user.email) + "!";
            } else {
                mensajeDiv.style.color = "#12B1D1";
                mensajeDiv.textContent = "Bienvenido, " + (data.user.username || data.user.email) + "!";
            }
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