// Verificamos si hay productos en el carrito almacenados en localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Verificamos si hay un usuario logueado
let usuarioActual = localStorage.getItem("usuario") || null;

// Función para agregar productos al carrito
function agregarAlCarrito(event) {
    if (!usuarioActual) {
        alert("Debes iniciar sesión para añadir productos al carrito.");
        window.location.href = "login.html";
        return;
    }

    const boton = event.target;
    const nombre = boton.getAttribute("data-name");
    const precio = parseFloat(boton.getAttribute("data-price"));

    if (!nombre || isNaN(precio)) {
        console.error("Error: Datos del producto no válidos.");
        return;
    }

    const producto = { nombre, precio };
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert(`${nombre} ha sido añadido al carrito.`);
}

// Función para asignar eventos a los botones "Añadir al carrito"
function asignarEventosCarrito() {
    const botones = document.querySelectorAll(".add-to-cart");
    if (botones.length === 0) {
        console.warn("No se encontraron botones 'Añadir al carrito'");
    }
    botones.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

// Función para mostrar el carrito en carrito.html
function mostrarCarrito() {
    const contenedorCarrito = document.getElementById("cart-items");
    const totalCarrito = document.getElementById("cart-total");

    if (!contenedorCarrito || !totalCarrito) return;

    // Restringir acceso si no hay usuario logueado
    if (!usuarioActual) {
        alert("Debes iniciar sesión para ver el carrito.");
        window.location.href = "login.html";
        return;
    }

    contenedorCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach((producto) => {
        total += producto.precio;

        const item = document.createElement("div");
        item.classList.add("cart-item");
        item.innerHTML = `
            <span>${producto.nombre}</span>
            <span>${producto.precio.toFixed(2)}€</span>
        `;

        contenedorCarrito.appendChild(item);
    });

    totalCarrito.textContent = total.toFixed(2);
}

// Función para finalizar la compra
function finalizarCompra(event) {
    event.preventDefault();

    const direccion = document.getElementById("direccion").value;
    const tarjeta = document.getElementById("tarjeta").value;

    if (!direccion || !tarjeta) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const pedido = {
        usuario: usuarioActual,
        direccion,
        tarjeta,
        productos: carrito.map(producto => producto.nombre)
    };

    fetch("/api/finalizar-compra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        localStorage.removeItem("carrito");
        window.location.href = "index.html";
    })
    .catch(error => console.error("Error al procesar la compra:", error));
}

// Función para manejar el login con el servidor
function login(event) {
    event.preventDefault();
    
    const usuario = document.getElementById("usuario").value;

    if (!usuario) {
        alert("Introduce un nombre de usuario.");
        return;
    }

    fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
            return;
        }

        localStorage.setItem("usuario", usuario);
        alert(`Bienvenido, ${usuario}`);
        window.location.href = "index.html";
    })
    .catch(error => console.error("Error al iniciar sesión:", error));
}


// Función para cerrar sesión
function logout() {
    localStorage.removeItem("usuario");
    alert("Sesión cerrada correctamente.");
    window.location.href = "index.html";
}

// Función para verificar sesión y actualizar UI
function verificarSesion() {
    const loginButton = document.getElementById("login-button");
    const logoutButton = document.getElementById("logout-button");
    const userDisplay = document.getElementById("user-display");

    if (usuarioActual) {
        if (loginButton) loginButton.style.display = "none";
        if (logoutButton) logoutButton.style.display = "inline-block";
        if (userDisplay) userDisplay.textContent = `Bienvenido, ${usuarioActual}`;
    } else {
        if (loginButton) loginButton.style.display = "inline-block";
        if (logoutButton) logoutButton.style.display = "none";
        if (userDisplay) userDisplay.textContent = "";
    }
}

// Asignamos eventos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    asignarEventosCarrito();
    mostrarCarrito();
    verificarSesion();

    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) checkoutForm.addEventListener("submit", finalizarCompra);

    const loginForm = document.getElementById("login-form");
    if (loginForm) loginForm.addEventListener("submit", login);

    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) logoutButton.addEventListener("click", logout);
});
