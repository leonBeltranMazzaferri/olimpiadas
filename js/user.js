document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/api/protected', {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        const mensajeDiv = document.getElementById('mensaje');
        if (data.user) {
            mensajeDiv.style.color = "#12B1D1";
            mensajeDiv.textContent = "Bienvenido, " + (data.user.username || data.user.email) + "!";
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