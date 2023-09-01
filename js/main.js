let carrito = [];
let total = 0;
let limitePorProducto = {};
let tasaInteres = 0.1;
let descuentoAplicado = false;
let codigoCoderUsado = false;
let cuotasSeleccionadas = 1;

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
    const cuotas = cuotasSeleccionadas;
    const totalEnCuotas = calcularTotalConInteres(total, cuotas);
    document.getElementById("total").textContent = total.toFixed(2);
    document.getElementById("costoCuota").textContent = (totalEnCuotas / cuotas).toFixed(2);
    document.getElementById("totalCuotas").textContent = totalEnCuotas.toFixed(2);
}

function calcularCuotas() {
    cuotasSeleccionadas = parseInt(document.getElementById("cuotas").value);
    calcularTotalEnCuotas();
}

function calcularTotalConInteres(capitalInicial, periodos) {
    return capitalInicial * Math.pow(1 + tasaInteres, periodos);
}

function aplicarDescuento() {
    if (codigoCoderUsado) {
        alert("El código CODER ya ha sido utilizado.");
        return;
    }

    const codigoDescuento = document.getElementById("codigoDescuento").value;
    if (codigoDescuento === "CODER" && !descuentoAplicado) {
        total *= 0.5;
        descuentoAplicado = true;
        codigoCoderUsado = true;
        actualizarCarrito();
        alert("Descuento aplicado con éxito.");
    } else {
        alert("Código de descuento no válido o ya aplicado.");
    }
}

function mostrarAlerta() {
    if (codigoCoderUsado) {
        alert("Aún no implementado.");
    } else {
        alert("Puedes utilizar el código CODER para obtener un 50% de descuento");
    }
}

function actualizarCarrito() {
    const carritoElement = document.getElementById("carrito");
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

    calcularTotalEnCuotas();
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarCarrito();

    document.getElementById("cuotas").onchange = calcularCuotas;
});