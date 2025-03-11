document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
        alert("Inicio de sesión exitoso");
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        window.location.href = "index.html";
    } else {
        alert("Error en el inicio de sesión");
    }
});
