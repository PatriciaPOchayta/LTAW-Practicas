// Verificamos si hay productos en el carrito almacenados en localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para agregar productos al carrito
function agregarAlCarrito(event) {
    const boton = event.target;
    const nombre = boton.getAttribute("data-name");
    const precio = parseFloat(boton.getAttribute("data-price"));

    const producto = { nombre, precio };

    carrito.push(producto); // Agregamos el producto al array
    localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardamos en localStorage

    alert(`${nombre} ha sido añadido al carrito.`);
}

// Función para mostrar el carrito en carrito.html
function mostrarCarrito() {
    const contenedorCarrito = document.getElementById("cart-items");
    const totalCarrito = document.getElementById("cart-total");

    if (!contenedorCarrito || !totalCarrito) return; // Si no estamos en carrito.html, salimos

    contenedorCarrito.innerHTML = ""; // Limpiamos antes de renderizar
    let total = 0;

    carrito.forEach((producto, index) => {
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
    // Agregar productos al carrito en las páginas de producto
    const botones = document.querySelectorAll(".add-to-cart");
    botones.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });

    // Mostrar carrito si estamos en carrito.html
    mostrarCarrito();
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
        productos: carrito
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
        alert("¡Compra realizada con éxito!");
        localStorage.removeItem("carrito"); // Vaciar el carrito
        window.location.href = "index.html"; // Redirigir a la tienda
    })
    .catch(error => console.error("Error al procesar la compra:", error));
}

// Asignar el evento al formulario en carrito.html
document.addEventListener("DOMContentLoaded", () => {
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", finalizarCompra);
    }
});
