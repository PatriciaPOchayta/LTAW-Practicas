document.addEventListener("DOMContentLoaded", () => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    function actualizarCarrito() {
        localStorage.setItem("carrito", JSON.stringify(carrito));
        document.getElementById("contador-carrito").innerText = carrito.length;
    }

    document.querySelectorAll(".agregar-carrito").forEach(boton => {
        boton.addEventListener("click", () => {
            const producto = {
                nombre: boton.dataset.nombre,
                precio: boton.dataset.precio
            };
            carrito.push(producto);
            actualizarCarrito();
            alert("Producto añadido al carrito");
        });
    });

    actualizarCarrito();
});
