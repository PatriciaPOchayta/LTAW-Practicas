// tienda.js - Servidor en Node.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8001;

// Función para cargar los datos desde tienda.json
function cargarDatos() {
    const data = fs.readFileSync('tienda.json', 'utf8');
    return JSON.parse(data);
}

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    let extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
        case '.jpeg':
        case '.png':
            contentType = 'image/jpeg';
            break;
    }

    // Ruta para obtener todos los productos
    if (req.url === '/api/productos') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cargarDatos().productos, null, 2));
        return;
    }

    // Ruta para obtener un producto por ID
    if (req.url.startsWith('/api/productos/')) {
        const id = parseInt(req.url.split('/').pop(), 10);
        const productos = cargarDatos().productos;
        const producto = productos.find(p => p.id === id);
        
        if (producto) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(producto, null, 2));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Producto no encontrado" }));
        }
        return;
    }

    // Servir archivos estáticos
    fs.readFile(filePath, (err, content) => {
        if (err) {
            fs.readFile(path.join(__dirname, 'error.html'), (error, errorContent) => {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(errorContent, 'utf-8');
            });
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});
