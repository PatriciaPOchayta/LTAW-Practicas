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
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert(`${nombre} ha sido añadido al carrito.`);
}

// Función para asignar eventos a los botones "Añadir al carrito"
function asignarEventosCarrito() {
    const botones = document.querySelectorAll(".add-to-cart");
    botones.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

// Función para mostrar el carrito en carrito.html
function mostrarCarrito() {
    const contenedorCarrito = document.getElementById("cart-items");
    const totalCarrito = document.getElementById("cart-total");

    if (!contenedorCarrito || !totalCarrito) return;

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

    const direccion = document.getElementById("direccion").value.trim();
    const tarjeta = document.getElementById("tarjeta").value.trim();

    if (!direccion || !tarjeta) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const pedido = {
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
        carrito = [];
        window.location.href = "index.html";
    })
    .catch(error => console.error("Error al procesar la compra:", error));
}

// Asignar eventos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    asignarEventosCarrito();
    mostrarCarrito();

    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) checkoutForm.addEventListener("submit", finalizarCompra);
});
