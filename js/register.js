document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const telefono = document.getElementById('telefono').value;
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = ""; // Limpia mensaje anterior

    const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, email, password, telefono })
    });

    const data = await res.json();
    if (res.ok) {
        mensajeDiv.style.color = "#12B1D1";
        mensajeDiv.textContent = "¡Registro exitoso! Ahora puedes iniciar sesión.";
        setTimeout(() => {
            window.location.href = "log.html";
        }, 2000); // 2000 milisegundos = 2 segundos
    } else {
        mensajeDiv.style.color = "red";
        mensajeDiv.textContent = data.error || 'Error al registrar usuario';
    }
});