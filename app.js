const vistaMenu = document.getElementById("vistaMenu");
const vistaTicket = document.getElementById("vistaTicket");
const vistaVentas = document.getElementById("vistaVentas");

const btnMenu = document.getElementById("btnMenu");
const btnTicket = document.getElementById("btnTicket");
const btnVentas = document.getElementById("btnVentas");

const nombreProducto = document.getElementById("nombreProducto");
const precioProducto = document.getElementById("precioProducto");
const imagenProducto = document.getElementById("imagenProducto");
const btnAgregar = document.getElementById("btnAgregar");
const listaProductos = document.getElementById("listaProductos");

const ticketDiv = document.getElementById("ticket");
const totalSpan = document.getElementById("total");
const btnCancelar = document.getElementById("btnCancelar");
const btnCobrar = document.getElementById("btnCobrar");
const ventasRecientes = document.getElementById("ventasRecientes");

let productos = [];
let ticket = JSON.parse(localStorage.getItem("ticket")) || [];
let ventas = JSON.parse(localStorage.getItem("ventas")) || [];

// --- Cambiar vistas ---
function cambiarVista(vista) {
    vistaMenu.classList.remove("activa");
    vistaTicket.classList.remove("activa");
    vistaVentas.classList.remove("activa");
    vista.classList.add("activa");
}

btnMenu.onclick = function () { cambiarVista(vistaMenu); };
btnTicket.onclick = function () { cambiarVista(vistaTicket); };
btnVentas.onclick = function () { cambiarVista(vistaVentas); };

//Agregar producto
btnAgregar.onclick = function () {
    const nombre = nombreProducto.value.trim();
    const precio = parseFloat(precioProducto.value);
    const imagen = imagenProducto.value.trim();

    if (nombre === "" || isNaN(precio) || precio <= 0) {
        alert("Datos inválidos");
        return;
    }

    const nuevo = {
        nombre: nombre,
        precio: precio,
        imagen: imagen === "" ? "https://via.placeholder.com/150" : imagen
    };

    productos.push(nuevo);
    nombreProducto.value = "";
    precioProducto.value = "";
    imagenProducto.value = "";
    mostrarProductos();
};

// Mostrar productos disponibles
function mostrarProductos() {
    listaProductos.innerHTML = "";
    for (let i = 0; i < productos.length; i++) {
        const p = productos[i];
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = "<img src='" + p.imagen + "' alt='" + p.nombre + "'>" +
            "<h3>" + p.nombre + "</h3>" +
            "<p>$" + p.precio.toFixed(2) + "</p>";
        div.onclick = function () {
            agregarAlTicket(i);
        };
        listaProductos.appendChild(div);
    }
}

//Agregar producto 
function agregarAlTicket(index) {
    const prod = productos[index];
    let existe = false;

    for (let i = 0; i < ticket.length; i++) {
        if (ticket[i].nombre === prod.nombre) {
            ticket[i].cantidad += 1;
            existe = true;
            break;
        }
    }

    if (!existe) {
        ticket.push({
            nombre: prod.nombre,
            precio: prod.precio,
            cantidad: 1
        });
    }

    guardarTicket();
    mostrarTicket();
}

function guardarTicket() {
    localStorage.setItem("ticket", JSON.stringify(ticket));
}

//Mostrar ticket
function mostrarTicket() {
    ticketDiv.innerHTML = "";
    let total = 0;

    for (let i = 0; i < ticket.length; i++) {
        const item = ticket[i];
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const div = document.createElement("div");
        div.className = "ticket-item";
        div.innerHTML = "<span>" + item.nombre + " x" + item.cantidad + "</span><span>$" + subtotal.toFixed(2) + "</span>";
        ticketDiv.appendChild(div);
    }

    totalSpan.textContent = total.toFixed(2);
}

//Cancelar productos
btnCancelar.onclick = function () {
    const codigo = prompt("Ingrese el codigo de supervisor:");
    if (codigo === "1234") {
        ticket = [];
        localStorage.removeItem("ticket");
        mostrarTicket();
        alert("Ticket cancelado.");
    } else {
        alert("Codigo incorrecto.");
    }
};

// Cobrar
btnCobrar.onclick = function () {
    if (ticket.length === 0) {
        alert("No hay productos en el ticket.");
        return;
    }

    const total = parseFloat(totalSpan.textContent);
    const venta = {
        fecha: new Date().toLocaleString(),
        total: total,
        productos: JSON.parse(JSON.stringify(ticket))
    };

    ventas.push(venta);
    localStorage.setItem("ventas", JSON.stringify(ventas));

    alert("Venta realizada con éxito.");
    ticket = [];
    localStorage.removeItem("ticket");
    mostrarTicket();
    mostrarVentas();
};

//Mostrar ventas recientes 
function mostrarVentas() {
    ventasRecientes.innerHTML = "";
    for (let i = 0; i < ventas.length; i++) {
        const v = ventas[i];
        let texto = "";
        for (let j = 0; j < v.productos.length; j++) {
            const p = v.productos[j];
            texto += p.nombre + " x" + p.cantidad + " ($" + (p.precio * p.cantidad).toFixed(2) + ")";
            if (j < v.productos.length - 1) texto += ", ";
        }

        const div = document.createElement("div");
        div.className = "venta";
        div.innerHTML = "<strong>" + v.fecha + "</strong><br>" +
            "<em>" + texto + "</em><br>" +
            "<strong>Total:</strong> $" + v.total.toFixed(2);
        ventasRecientes.appendChild(div);
    }
}


mostrarProductos();
mostrarTicket();
mostrarVentas();
