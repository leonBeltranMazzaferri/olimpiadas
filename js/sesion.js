/**
 * Comprueba si el usuario está autenticado al cargar la página.
 * Muestra u oculta los enlaces de login/perfil según el estado de autenticación.
 */
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/api/protected', {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        if (data.user) {
            // Usuario autenticado: muestra "PERFIL", oculta "LOGIN"
            document.getElementById('login-link').style.display = 'none';
            document.getElementById('user-link').style.display = '';
        } else {
            // Usuario no autenticado: muestra "LOGIN", oculta "PERFIL"
            document.getElementById('login-link').style.display = '';
            document.getElementById('user-link').style.display = 'none';
        }


        // Si es admin, genera el enlace de admin
        if (data.user && data.user.rolUser === 1) {
            // Verifica que no exista ya el enlace
            if (!document.getElementById('admin-link')) {
                // Selecciona correctamente el <ul class="nav-list">
                const nav = document.querySelector('.nav-list');
                if (nav) {
                    const adminLink = document.createElement('li');
                    adminLink.id = 'admin-link';
                    const a = document.createElement('a');
                    a.href = 'admin.html';
                    a.textContent = 'ADMIN';
                    adminLink.appendChild(a);
                    nav.appendChild(adminLink);
                }
            }
        }
    })
    .catch(() => {
        // Si hay error, asume que no está autenticado
        document.getElementById('login-link').style.display = '';
        document.getElementById('user-link').style.display = 'none';
    });
});