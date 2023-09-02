let carrito = {};
let total = 0;
let tasaInteresInicial = 0.1;
let tasaInteresFinal = 0.15;
let descuentoAplicado = false;
let codigoCoderUsado = false;
let cuotasSeleccionadas = 1;
const limitePorProducto = {};

const agregarProducto = (nombre, precio) => {
    if (limitePorProducto[nombre] === undefined || limitePorProducto[nombre] < 3) {
        if (carrito[nombre] === undefined) {
            carrito[nombre] = {
                cantidad: 1,
                precio: precio,
            };
        } else {
            carrito[nombre].cantidad++;
        }

        total += precio;
        actualizarCarrito();
        limitePorProducto[nombre] = (limitePorProducto[nombre] || 0) + 1;
    } else {
        alert(`¡Ya tienes 3 ${nombre} en tu carrito!`);
    }
};

const eliminarProducto = (nombre) => {
    if (carrito[nombre] !== undefined) {
        const precioPorProducto = carrito[nombre].precio;
        total -= precioPorProducto;
        carrito[nombre].cantidad--;

        if (carrito[nombre].cantidad === 0) {
            delete carrito[nombre];
        }

        actualizarCarrito();
        limitePorProducto[nombre]--;
    }
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
    calcularTotalEnCuotas();
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
        codigoCoderUsado = true;
        actualizarCarrito();
        alert("Descuento aplicado con éxito.");
    } else {
        alert("Código de descuento no válido o ya aplicado.");
    }
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

    for (const nombreProducto in carrito) {
        const producto = carrito[nombreProducto];
        const li = document.createElement("li");
        li.textContent = `${nombreProducto} x${producto.cantidad} - $${producto.precio * producto.cantidad}`;
        const eliminarButton = document.createElement("button");
        eliminarButton.textContent = "Eliminar";
        eliminarButton.onclick = () => eliminarProducto(nombreProducto);
        li.appendChild(eliminarButton);
        carritoElement.appendChild(li);
    }

    calcularTotalEnCuotas();

    //guardarCarritoEnJSON();
};

/*
const guardarCarritoEnJSON = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

const cargarCarritoDesdeJSON = () => {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
};


*/

document.addEventListener("DOMContentLoaded", () => {
    actualizarCarrito();

    document.getElementById("cuotas").onchange = calcularCuotas;

    //cargarCarritoDesdeJSON();
});