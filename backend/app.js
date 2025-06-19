const mysql = require('mysql2')
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json()) // Para leer JSON en POST

const DB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'agencia_paquetes'
})

DB.connect((err) => {
    if (err) {
        console.error('Error conectandose a la base de datos: ', err)
        return
    }
    console.log('Conectado a la base de datos!')
});

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

            res.json({ success: true, message: 'Login exitoso' });
        }
    );
});

app.get('/vuelo', (req, res) => {
    const idVuelo = parseInt(req.query.idVuelo)
    DB.query('SELECT * FROM vuelos WHERE id_vuelo = ?', [idVuelo], (err, resultado) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener los vuelos' })
            return
        }
        res.json(resultado)
    })
})

app.listen(3000, () => {
    console.log('Express escuchando en puerto 3000')
})