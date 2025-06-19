document.querySelector('.form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = ""; // Limpia mensaje anterior

    const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: "include"
    });

    const data = await res.json();
    if (res.ok) {
        mensajeDiv.textContent = "Login exitoso";
        setTimeout(() => {
            window.location.href = "user.html";
        }, 1000);
    } else {
        mensajeDiv.style.color = "red";
        mensajeDiv.textContent = data.error || 'Error al iniciar sesión';
    }
});