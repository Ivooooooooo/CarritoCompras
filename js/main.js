let carrito = [];
let total = 0;
let tasaInteresInicial = 0.1;
let tasaInteresFinal = 0.15;
let descuentoAplicado = false;
let codigoCoderUsado = false;
let cuotasSeleccionadas = 1;
const limitePorProducto = {};

class Producto {
    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = 1;
    }
}

const agregarProducto = (nombre, precio) => {
    if (limitePorProducto[nombre] === undefined || limitePorProducto[nombre] < 3) {
        const productoExistente = carrito.find((producto) => producto.nombre === nombre);

        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            const nuevoProducto = new Producto(nombre, precio);
            carrito.push(nuevoProducto);
        }

        total += precio;
        actualizarCarrito();
        limitePorProducto[nombre] = (limitePorProducto[nombre] || 0) + 1;
    } else {
        alert(`¡Ya tienes 3 ${nombre} en tu carrito!`);
    }
    console.log("Producto agregado:", nombre, "Precio:", precio, "Carrito:", carrito, "Total:", total);
};

const eliminarProducto = (nombre) => {
    const productoIndex = carrito.findIndex((producto) => producto.nombre === nombre);

    if (productoIndex !== -1) {
        const precioPorProducto = carrito[productoIndex].precio;
        total -= precioPorProducto;
        carrito[productoIndex].cantidad--;

        if (carrito[productoIndex].cantidad === 0) {
            carrito.splice(productoIndex, 1);
        }

        actualizarCarrito();
        limitePorProducto[nombre]--;
    }
    console.log("Producto eliminado:", nombre, "Carrito:", carrito, "Total:", total);
};

const buscarProducto = (nombre) => {
    return carrito.find((producto) => producto.nombre === nombre);
};

const filtrarProductosConDescuento = () => {
    return carrito.filter((producto) => producto.descuento);
};

const calcularTotalEnCuotas = () => {
    const cuotas = cuotasSeleccionadas;
    const totalEnCuotas = calcularTotalConInteres(total, cuotas);
    document.getElementById("total").textContent = total.toFixed(2);
    document.getElementById("costoCuota").textContent = (totalEnCuotas / cuotas).toFixed(2);
    document.getElementById("totalCuotas").textContent = totalEnCuotas.toFixed(2);
};

const calcularCuotas = () => {
    cuotasSeleccionadas = parseInt(document.getElementById("cuotas").value);
    if (!isNaN(cuotasSeleccionadas) && cuotasSeleccionadas > 0) {
        calcularTotalEnCuotas();
    } else {
        alert("Por favor, ingrese un número válido de cuotas.");
    }

    console.log("Cuotas seleccionadas:", cuotasSeleccionadas);
};

const calcularTotalConInteres = (capitalInicial, periodos) => {
    let tasaInteres = calcularTasaInteres(periodos);
    return capitalInicial * Math.pow(1 + tasaInteres, periodos);
};

const calcularTasaInteres = (periodos) => {
    return tasaInteresInicial + (periodos - 1) * ((tasaInteresFinal - tasaInteresInicial) / 4);
};

const aplicarDescuento = () => {
    if (codigoCoderUsado) {
        alert("El código CODER ya ha sido utilizado.");
        return;
    }

    const codigoDescuento = document.getElementById("codigoDescuento").value;
    if (codigoDescuento === "CODER" && !descuentoAplicado) {
        total *= 0.5;
        descuentoAplicado = true;

        carrito.forEach((producto) => {
            if (producto.nombre.includes("descuento")) { /* sin implementar */
                producto.descuento = true;
            }
        });

        actualizarCarrito();
        alert("Descuento aplicado con éxito.");
    } else {
        alert("Código de descuento no válido o ya aplicado.");
    }

    console.log("Código de descuento:", codigoDescuento, "Descuento aplicado:", descuentoAplicado, "Total:", total);
};

const mostrarAlerta = () => {
    if (codigoCoderUsado) {
        alert("Aún no implementado.");
    } else {
        alert("Puedes utilizar el código CODER para obtener un 50% de descuento");
    }
};

const actualizarCarrito = () => {
    const carritoElement = document.getElementById("carrito");
    carritoElement.innerHTML = "";

    carrito.forEach((producto) => {
        const li = document.createElement("li");
        li.textContent = `${producto.nombre} x${producto.cantidad} - $${producto.precio * producto.cantidad}`;
        const eliminarButton = document.createElement("button");
        eliminarButton.textContent = "Eliminar";
        eliminarButton.onclick = () => eliminarProducto(producto.nombre);
        li.appendChild(eliminarButton);
        carritoElement.appendChild(li);
    });

    calcularTotalEnCuotas();

    console.log("Carrito actualizado:", carrito, "Total:", total);
};

document.addEventListener("DOMContentLoaded", () => {
    actualizarCarrito();

    document.getElementById("cuotas").onchange = calcularCuotas;

    console.log("Página cargada y carrito actualizado.");
});