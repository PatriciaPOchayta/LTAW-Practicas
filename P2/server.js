const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 8001;

app.use(express.json());
app.use(cors());
app.use(express.static("public")); // Servir archivos estáticos (HTML, CSS, JS)

// Cargar base de datos desde JSON
const loadDatabase = () => {
  const data = fs.readFileSync("tienda.json");
  return JSON.parse(data);
};

// Guardar base de datos en JSON
const saveDatabase = (data) => {
  fs.writeFileSync("tienda.json", JSON.stringify(data, null, 2));
};

// 📌 Endpoint para obtener todos los productos
app.get("/api/productos", (req, res) => {
  const db = loadDatabase();
  res.json(db.productos);
});

// 📌 Endpoint para obtener un producto por su nombre
app.get("/api/productos/:nombre", (req, res) => {
  const db = loadDatabase();
  const producto = db.productos.find((p) => p.nombre === req.params.nombre);
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ mensaje: "Producto no encontrado" });
  }
});

// 📌 Endpoint para login de usuario
app.post("/api/login", (req, res) => {
  const { nombre, correo } = req.body;
  const db = loadDatabase();
  const usuario = db.usuarios.find(
    (u) => u.nombre === nombre && u.correo === correo
  );

  if (usuario) {
    res.json({ mensaje: "Login exitoso", usuario });
  } else {
    res.status(401).json({ mensaje: "Credenciales incorrectas" });
  }
});

// 📌 Endpoint para realizar un pedido
app.post("/api/pedidos", (req, res) => {
  const { usuario, direccion, tarjeta, productos } = req.body;
  const db = loadDatabase();

  // Verificar si el usuario existe
  const userExists = db.usuarios.some((u) => u.nombre === usuario);
  if (!userExists) {
    return res.status(400).json({ mensaje: "Usuario no encontrado" });
  }

  // Crear nuevo pedido
  const nuevoPedido = {
    usuario,
    direccion,
    tarjeta,
    productos,
  };

  db.pedidos.push(nuevoPedido);
  saveDatabase(db);

  res.json({ mensaje: "Pedido realizado con éxito", pedido: nuevoPedido });
});

// Iniciar el servidor en el puerto 8001
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
