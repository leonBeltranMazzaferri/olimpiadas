const mysql = require('mysql2')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors({ origin: '*' }))

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

app.get('/vuelos', (req, res) => {
    const cantidad = parseInt(req.query.cantidad, 10) || 10
    DB.query('SELECT * FROM vuelos ORDER BY RAND() LIMIT ?', [cantidad], (err, resultado) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener los vuelos' })
            return
        }
        res.json(resultado)
    })
})

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

