const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8001;

// Función para cargar los datos desde tienda.json
function cargarDatos() {
    const data = fs.readFileSync('tienda.json', 'utf8');
    return JSON.parse(data);
}

// Función para guardar los datos en tienda.json
function guardarDatos(datos) {
    fs.writeFileSync('tienda.json', JSON.stringify(datos, null, 2));
}

// Función para buscar un usuario por nombre
function buscarUsuario(nombre) {
    const datos = cargarDatos();
    return datos.usuarios.find(user => user.nombre === nombre);
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

    // Ruta para obtener los usuarios
    if (req.url === '/api/usuarios') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cargarDatos().usuarios, null, 2));
        return;
    }

    // Ruta para procesar la compra
    if (req.method === 'POST' && req.url === '/api/finalizar-compra') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const pedido = JSON.parse(body);
            let datos = cargarDatos();
            datos.pedidos.push(pedido);
            guardarDatos(datos);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Pedido guardado correctamente' }));
        });
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
