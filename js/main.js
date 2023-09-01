let carrito = [];
let total = 0;
let limitePorProducto = {};
let tasaInteres = 0.1;
let descuentoAplicado = false;

function agregarProducto(nombre, precio) {
    if (limitePorProducto[nombre] === undefined || limitePorProducto[nombre] < 3) {
        carrito.push({
            nombre,
            precio
        });
        total += precio;
        actualizarCarrito();
        limitePorProducto[nombre] = (limitePorProducto[nombre] || 0) + 1;
    } else {
        alert(`¡Ya tienes 3 ${nombre} en tu carrito!`);
    }
}

function eliminarProducto(index) {
    const producto = carrito[index];
    total -= producto.precio;
    limitePorProducto[producto.nombre] -= 1;
    carrito.splice(index, 1);
    actualizarCarrito();
}

function calcularTotalEnCuotas() {
    const cuotas = parseInt(document.getElementById("cuotas").value);
    const totalEnCuotas = calcularTotalConInteres(total, cuotas);
    document.getElementById("totalCuotas").textContent = totalEnCuotas.toFixed(2);
}

function calcularTotalConInteres(capitalInicial, periodos) {
    return capitalInicial * Math.pow(1 + tasaInteres, periodos);
}

function aplicarDescuento() {
    const codigoDescuento = document.getElementById("codigoDescuento").value;
    if (codigoDescuento === "CODER" && !descuentoAplicado) {
        total *= 0.5;
        descuentoAplicado = true;
        actualizarCarrito();
        alert("Descuento aplicado con éxito.");
    } else {
        alert("Código de descuento no válido o ya aplicado.");
    }
}

function actualizarCarrito() {
    const carritoElement = document.getElementById("carrito");
    const totalElement = document.getElementById("total");

    carritoElement.innerHTML = "";
    carrito.forEach((producto, index) => {
        const li = document.createElement("li");
        li.textContent = `${producto.nombre} - $${producto.precio}`;
        const eliminarButton = document.createElement("button");
        eliminarButton.textContent = "Eliminar";
        eliminarButton.onclick = () => eliminarProducto(index);
        li.appendChild(eliminarButton);
        carritoElement.appendChild(li);
    });

    totalElement.textContent = total.toFixed(2);
    calcularTotalEnCuotas();
}