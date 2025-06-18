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
    database: 'agencia_vuelos'
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
    const { correo, contrasena, dni } = req.body
    if (!correo || !contrasena || !dni) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' })
    }
    try {
        const hashedPassword = await bcrypt.hash(contrasena, 8)
        DB.query(
            'INSERT INTO clientes (correo, contrasena, dni) VALUES (?, ?, ?)',
            [correo, hashedPassword, dni],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ error: 'El correo o DNI ya está registrado' })
                    }
                    return res.status(500).json({ error: 'Error al registrar usuario' })
                }
                res.json({ success: true, message: 'Usuario registrado' })
            }
        )
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' })
    }
})

// Login de usuario
app.post('/api/login', (req, res) => {
    const { correo, contrasena } = req.body
    if (!correo || !contrasena) {
        return res.status(400).json({ error: 'Correo y contraseña requeridos' })
    }
    DB.query(
        'SELECT * FROM clientes WHERE correo = ?',
        [correo],
        async (err, results) => {
            if (err) return res.status(500).json({ error: 'Error en el servidor' })
            if (results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' })

            const user = results[0]
            const valid = await bcrypt.compare(contrasena, user.contrasena)
            if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' })

            res.json({ success: true, message: 'Login exitoso' })
        }
    )
})



app.listen(3000, () => {
    console.log('Express escuchando en puerto 3000')
})