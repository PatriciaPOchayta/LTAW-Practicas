const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 8001;

app.use(express.json());
app.use(cors());

const DATA_FILE = 'tienda.json';

// Función para leer la base de datos
const leerDatos = () => {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
};

// Función para escribir en la base de datos
const escribirDatos = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

// Endpoint para obtener productos
app.get('/productos', (req, res) => {
    const datos = leerDatos();
    res.json(datos.productos);
});

// Endpoint para obtener un solo producto
app.get('/productos/:nombre', (req, res) => {
    const datos = leerDatos();
    const producto = datos.productos.find(p => p.nombre === req.params.nombre);
    if (producto) {
        res.json(producto);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Endpoint para login de usuarios
app.post('/login', (req, res) => {
    const { nombre, correo } = req.body;
    const datos = leerDatos();
    const usuario = datos.usuarios.find(u => u.nombre === nombre && u.correo === correo);
    
    if (usuario) {
        res.json({ mensaje: 'Login exitoso', usuario });
    } else {
        res.status(401).json({ error: 'Credenciales incorrectas' });
    }
});

// Endpoint para registrar un pedido
app.post('/pedido', (req, res) => {
    const { nombre_usuario, direccion_envio, numero_tarjeta, productos } = req.body;
    
    if (!nombre_usuario || !direccion_envio || !numero_tarjeta || !productos.length) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    const datos = leerDatos();
    datos.pedidos.push({ nombre_usuario, direccion_envio, numero_tarjeta, productos });
    escribirDatos(datos);

    res.json({ mensaje: 'Pedido registrado correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
