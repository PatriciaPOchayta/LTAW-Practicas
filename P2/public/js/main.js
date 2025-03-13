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

// Asignamos el evento a todos los botones "Añadir al carrito"
document.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll(".add-to-cart");
    botones.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
});
