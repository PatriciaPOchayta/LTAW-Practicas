const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8001;

function cargarDatos() {
    try {
        const data = fs.readFileSync('tienda.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer tienda.json:", error);
        return { productos: [] };
    }
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // 🔹 API de búsqueda de productos
    if (pathname === "/api/buscar-producto" && req.method === "GET") {
        const query = parsedUrl.query.nombre?.toLowerCase();
        if (!query) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "No se proporcionó un término de búsqueda" }));
        }

        const productos = cargarDatos().productos.filter(producto =>
            producto.nombre.toLowerCase().includes(query)
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(productos));
    }

    // 🔹 Servir archivos estáticos
    let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
    let extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.css': contentType = 'text/css'; break;
        case '.js': contentType = 'text/javascript'; break;
        case '.json': contentType = 'application/json'; break;
        case '.jpg': case '.jpeg': case '.png': contentType = 'image/jpeg'; break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end("Página no encontrada", 'utf-8');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});

