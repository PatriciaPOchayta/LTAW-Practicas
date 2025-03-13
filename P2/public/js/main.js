// Verificamos si hay productos en el carrito almacenados en localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para agregar productos al carrito
function agregarAlCarrito(event) {
    const boton = event.target;
    const nombre = boton.getAttribute("data-name");
    const precio = parseFloat(boton.getAttribute("data-price"));

    if (!nombre || isNaN(precio)) {
        console.error("Error: Datos del producto no válidos.");
        return;
    }

    const producto = { nombre, precio };

    carrito.push(producto); // Agregamos el producto al array
    localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardamos en localStorage

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

    if (!contenedorCarrito || !totalCarrito) return; // Si no estamos en carrito.html, salimos

    contenedorCarrito.innerHTML = ""; // Limpiamos antes de renderizar
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

// Asignamos eventos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    asignarEventosCarrito(); // Asegurar que los botones tengan eventos

    // Mostrar carrito si estamos en carrito.html
    mostrarCarrito();

    // Asignar el evento al formulario en carrito.html
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", finalizarCompra);
    }
});

function finalizarCompra(event) {
    event.preventDefault(); // Evitamos que el formulario recargue la página

    const direccion = document.getElementById("direccion").value;
    const tarjeta = document.getElementById("tarjeta").value;

    if (!direccion || !tarjeta) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const pedido = {
        usuario: "usuario_prueba", // Cambiar cuando se implemente login
        direccion,
        tarjeta,
        productos: carrito.map(producto => producto.nombre)
    };

    // Enviar el pedido al servidor
    fetch("/api/finalizar-compra", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pedido)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        localStorage.removeItem("carrito"); // Vaciar el carrito
        window.location.href = "index.html"; // Redirigir a la tienda
    })
    .catch(error => console.error("Error al procesar la compra:", error));
}
