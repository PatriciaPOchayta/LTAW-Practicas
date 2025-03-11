const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8001;

// Función para cargar los datos desde tienda.json
function cargarDatos() {
    const data = fs.readFileSync('tienda.json', 'utf8');
    return JSON.parse(data);
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

    // Si la solicitud es para obtener los usuarios (ejemplo: /api/usuarios)
    if (req.url === '/api/usuarios') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cargarDatos().usuarios, null, 2));
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
