const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8001;
const DATA_FILE = 'tienda.json'; 

// Función para cargar los datos desde tienda.json
function cargarDatos() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer la base de datos:', error);
        return { usuarios: [], productos: [], pedidos: [] };
    }
}

// Función para guardar datos en tienda.json
function guardarDatos(datos) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(datos, null, 2), 'utf8');
    } catch (error) {
        console.error('Error al escribir en la base de datos:', error);
    }
}

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/api/usuarios') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cargarDatos().usuarios, null, 2));
        return;
    }
    
    if (req.method === 'GET' && req.url === '/api/productos') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cargarDatos().productos, null, 2));
        return;
    }
    
    if (req.method === 'POST' && req.url === '/api/pedidos') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const pedido = JSON.parse(body);
                const datos = cargarDatos();
                datos.pedidos.push(pedido);
                guardarDatos(datos);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ mensaje: 'Pedido registrado con éxito' }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error al procesar el pedido' }));
            }
        });
        return;
    }
    
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

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>Página no encontrada</h1>', 'utf-8');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});
