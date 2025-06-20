const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MercadoPagoConfig, Preference } = require('mercadopago');
require('dotenv').config();

const app = express();

// Configuración de MercadoPago con el token de acceso
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Configuración de CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Conexión a la base de datos MySQL
const DB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: process.env.DB_NAME
});

// Verifica la conexión a la base de datos al iniciar el servidor
DB.connect((err) => {
    if (err) {
        console.error('Error conectandose a la base de datos: ', err);
        return;
    }
    console.log('Conectado a la base de datos!');
});

/**
 * Middleware para proteger rutas que requieren autenticación.
 * Verifica el token JWT en las cookies.
 */
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

/**
 * Registro de usuario.
 * Recibe datos, valida, hashea la contraseña y guarda el usuario en la base de datos.
 */
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

/**
 * Login de usuario.
 * Verifica email y contraseña, genera un token JWT y lo guarda en una cookie.
 */
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
            let token;
            if (user.admin === 1) {
                // Token para admin, con expiración de 12h
                token = jwt.sign(
                    { id_usuario: user.id_usuario, email: user.email, username: user.nombre, rolUser: user.admin },
                    process.env.SECRET_KEY,
                    { expiresIn: '8h' }
                );
            } else {
                // Token para cliente, con expiración de 24h
                token = jwt.sign(
                    { id_usuario: user.id_usuario, email: user.email, username: user.nombre, rolUser: user.admin },
                    process.env.SECRET_KEY,
                    { expiresIn: '24h' }
                );
            }         

            // Guarda el token en una cookie segura
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true, 
                maxAge: 1 * 24 * 60 * 60 * 1000 // 1 día
            });

            res.json({ success: true, message: 'Login exitoso', token });
        }
    );
});

/**
 * Logout de usuario.
 * Elimina la cookie del token.
 */
app.post('/api/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    });
    res.json({ success: true, message: 'Sesión cerrada' });
});

/**
 * Ruta protegida para comprobar autenticación.
 * Devuelve los datos del usuario si el token es válido.
 */
app.get('/api/protected', authMiddleware, (req, res) => {
    // req.user contiene los datos del token, incluyendo rolUser
    if (req.user.rolUser === 1) {
        // Es admin
        res.json({ message: '¡Acceso permitido! (admin)', user: req.user, tipo: 'admin' });
    } else {
        // Es cliente
        res.json({ message: '¡Acceso permitido! (cliente)', user: req.user, tipo: 'cliente' });
    }
});

/**
 * Obtiene un paquete por su ID.
 */
app.get('/api/paquete', (req, res) => {
    const id_pedido = parseInt(req.query.id)
    DB.query('SELECT * FROM paquete WHERE id_paquete = ?', [id_pedido] , (err, resultado) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener los paquetes' });
            return;
        }
        res.json(resultado);
    });
});

/**
 * Obtiene todos los paquetes.
 */
app.get('/api/paquetes', (req, res) => {
    DB.query('SELECT * FROM paquete', (err, resultado) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener los paquetes' });
            return;
        }
        res.json(resultado);
    });
});

/**
 * Agrega un nuevo producto (paquete) a la base de datos.
 */
app.post('/api/agregarProducto', (req, res) => {
    const { nombre, destino, descripcion, precioUnitario} = req.body
    if (!nombre || !destino || !descripcion || !precioUnitario) {
        return res.status(400).json({ error: 'Valores insuficientes'})
    }
    DB.query('INSERT INTO paquete (nombre, descripcion, precio, destino) VALUES (?, ?, ?, ?)', 
        [nombre, descripcion, precioUnitario, destino],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error en el servidor' })
            res.json({ success: true, message: 'Producto agregado exitosamente.'})
        }
    )
})

/**
 * Obtiene todos los productos (paquetes).
 */
app.get('/api/obtenerProductos', (req, res) => {
    DB.query('SELECT * FROM paquete', 
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Error en el servidor' })
            res.json(result)
        }
    )
})

/**
 * Obtiene todos los pedidos pendientes.
 */
app.get('/api/obtenerPendientes', (req, res) => {
    DB.query('SELECT * FROM compra WHERE estado = "Pendiente"', 
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Error en el servidor' })
            res.json(result)
        }
    )
})

/**
 * Obtiene todos los clientes registrados.
 */
app.get('/api/obtenerClientes', (req, res) => {
    DB.query('SELECT id_usuario, nombre, apellido, email, telefono FROM usuario', 
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Error en el servidor' })
            res.json(result)
        }
    )
})

/**
 * Obtiene todos los pedidos de un cliente específico.
 */
app.get('/api/obtenerPedidosCliente', (req, res) => {
    const idCliente = parseInt(req.query.id)
    if (!idCliente) return res.status(400).json({ error: 'Valores insuficientes'})
    DB.query('SELECT * FROM compra WHERE id_usuario = ? ORDER BY fecha_compra DESC', 
        [idCliente],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Error en el servidor' })
            res.json(result)
        }
    )
})

/**
 * Cambia el estado de un pedido (por ejemplo, a "Anulado" o "Entregado").
 */
app.get('/api/clientePedidos', (req, res) => {
    const idCliente = parseInt(req.query.id)
    if (!idCliente) return res.status(400).json({ error: 'Valores insuficientes'})
    DB.query('SELECT compra.id_compra, paquete.nombre AS nombre_paquete, paquete.precio AS precio_paquete, compra.fecha_compra, compra.estado FROM compra JOIN paquete ON compra.id_paquete = paquete.id_paquete WHERE compra.id_usuario = 8', 
        [idCliente],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Error en el servidor' })
            res.json(result)
        }
    )
})

app.get('/api/cancelarPedido', (req, res) => {
    const idCompra = parseInt(req.query.id)
    DB.query('UPDATE compra SET estado = "Cancelado" WHERE id_compra = ?', [idCompra], 
        (err) => {
            if (err) return res.status(500).json({ error: 'Error en el servidor' })
            res.json({ success: true, message: 'Estado de pedido cambiado exitosamente.'})
        })
})

app.get('/api/anularPedido', (req, res) => {
    const idCompra = parseInt(req.query.id)
    const estadoNuevo = req.query.estado
    DB.query('UPDATE compra SET estado = ? WHERE id_compra = ?', [estadoNuevo, idCompra], 
        (err) => {
            if (err) return res.status(500).json({ error: 'Error en el servidor' })
            res.json({ success: true, message: 'Estado de pedido cambiado exitosamente.'})
        })
})

/**
 * Calcula el precio total de varios paquetes dados sus IDs.
 * Espera un array de IDs en el body.
 */
app.post('/api/ObtenerPrecios', (req, res) => {
    const ids = req.body.ids; // Espera un array de IDs en el body
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.json({ total: 0 });
    }
    const placeholders = ids.map(() => '?').join(',');
    DB.query(`SELECT precio FROM paquete WHERE id_paquete IN (${placeholders})`, ids, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        const total = results.reduce((sum, row) => sum + Number(row.precio), 0);
        res.json({ total });
    });
});

/**
 * Crea una preferencia de pago en MercadoPago y devuelve el enlace de pago.
 */
app.post('/api/crearPreferencia', async (req, res) => {
    const { nombre, precio } = req.body;
    try {
        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: [
                    {
                        title: nombre,
                        quantity: 1,
                        unit_price: Number(precio)
                    }
                ]
            }
        });
        res.json({ id: result.id, init_point: result.init_point });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear preferencia de pago' });
    }
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Express escuchando en puerto 3000');
});