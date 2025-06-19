document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/api/protected', {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        if (data.user) {
            // Usuario autenticado: muestra "PERFIL", oculta "LOGIN" y "CREAR CUENTA"
            document.getElementById('login-link').style.display = 'none';
            document.getElementById('register-link').style.display = 'none';
            document.getElementById('user-link').style.display = '';
        } else {
            // Usuario no autenticado: muestra "LOGIN" y "CREAR CUENTA", oculta "PERFIL"
            document.getElementById('login-link').style.display = '';
            document.getElementById('register-link').style.display = '';
            document.getElementById('user-link').style.display = 'none';
        }
    })
    .catch(() => {
        // Si hay error, asume que no está autenticado
        document.getElementById('login-link').style.display = '';
        document.getElementById('register-link').style.display = '';
        document.getElementById('user-link').style.display = 'none';
    });
});