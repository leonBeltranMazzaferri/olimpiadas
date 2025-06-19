const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const DB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: process.env.DB_NAME
});

DB.connect((err) => {
    if (err) {
        console.error('Error conectandose a la base de datos: ', err);
        return;
    }
    console.log('Conectado a la base de datos!');
});

// Middleware de autenticación
function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ error: 'No autorizado' });

    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        req.user = data;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}

// Registro de usuario
app.post('/api/register', async (req, res) => {
    const { nombre, apellido, email, password, telefono } = req.body;
    if (!nombre || !apellido || !email || !password || !telefono) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 8);
        DB.query(
            'INSERT INTO usuario (nombre, apellido, email, contraseña, telefono) VALUES (?, ?, ?, ?, ?)',
            [nombre, apellido, email, hashedPassword, telefono],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ error: 'El email ya está registrado' });
                    }
                    return res.status(500).json({ error: 'Error al registrar usuario' });
                }
                res.json({ success: true, message: 'Usuario registrado' });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Login de usuario
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }
    DB.query(
        'SELECT * FROM usuario WHERE email = ?',
        [email],
        async (err, results) => {
            if (err) return res.status(500).json({ error: 'Error en el servidor' });
            if (results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

            const user = results[0];
            const valid = await bcrypt.compare(password, user.contraseña);
            if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

            const token = jwt.sign(
                { id_usuario: user.id_usuario, email: user.email, username: user.nombre },
                process.env.SECRET_KEY,
                { expiresIn: '1h' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true, 
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.json({ success: true, message: 'Login exitoso', token });
        }
    );
});

// Logout
app.post('/api/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    });
    res.json({ success: true, message: 'Sesión cerrada' });
});

// Ruta protegida de ejemplo
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: '¡Acceso permitido!', user: req.user });
});

// Ejemplo de consulta de vuelo
app.get('/vuelo', (req, res) => {
    const idVuelo = parseInt(req.query.idVuelo);
    DB.query('SELECT * FROM vuelos WHERE id_vuelo = ?', [idVuelo], (err, resultado) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener los vuelos' });
            return;
        }
        res.json(resultado);
    });
});

app.listen(3000, () => {
    console.log('Express escuchando en puerto 3000');
});