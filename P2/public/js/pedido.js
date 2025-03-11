document.getElementById("pedido-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
        alert("Debe iniciar sesión para realizar un pedido");
        return;
    }

    const direccion = document.getElementById("direccion").value;
    const tarjeta = document.getElementById("tarjeta").value;
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    const response = await fetch("/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: usuario.nombre, direccion, tarjeta, productos: carrito })
    });

    const data = await response.json();

    if (data.success) {
        alert("Pedido realizado con éxito");
        localStorage.removeItem("carrito");
        window.location.href = "index.html";
    } else {
        alert("Error al procesar el pedido");
    }
});
