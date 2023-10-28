const elementos = {
    botonAgregarMonitor: document.getElementById("agregarMonitor"),
    botonAgregarCelular: document.getElementById("agregarCelular"),
    botonAgregarLaptop: document.getElementById("agregarLaptop"),
    botonAplicarDescuento: document.getElementById("aplicarDescuento"),
    cuotasSelector: document.getElementById("cuotasSelector"),
    botonPagar: document.getElementById("botonPagar"),
    detallesProducto: document.getElementById("detallesProducto"),
    nombreProducto: document.getElementById("nombreProducto"),
    precioProducto: document.getElementById("precioProducto"),
    descripcionProducto: document.getElementById("descripcionProducto"),
    carritoElement: document.getElementById("carrito"),
    detallesProductosContainer: document.getElementById("detallesProductosContainer"),
    cuotasInput: document.getElementById("cuotas"),
    codigoDescuentoInput: document.getElementById("codigoDescuento"),
    totalElement: document.getElementById("total"),
    costoCuotaElement: document.getElementById("costoCuota"),
    totalCuotasElement: document.getElementById("totalCuotas"),
    totalDolarElement: document.getElementById("totalDolar"),
};

const carrito = [];

const productos = {
    1: {
        nombre: "Monitor",
        precio: 200,
        descripcion: "Monitor de 19 pulgadas, ideal para tareas de oficina.",
        /* No implementado
        imagen: "./images/monitor.png",
        descuento: false 
        */
    },
    2: {
        nombre: "Celular",
        precio: 500,
        descripcion: "Teléfono celular de última generación con cámara de alta resolución.",
        /* No implementado
        imagen: "./images/celular.png",
        descuento: false 
        */
    },
    3: {
        nombre: "Laptop",
        precio: 800,
        descripcion: "Laptop potente para juegos con pantalla Full HD.",
        /* No implementado
        imagen: "./images/laptop.png",
        descuento: false 
        */
    },
};

const productosAgregados = {};
const cantidadPorProducto = {};
let total = 0;
let tasaInteresInicial = 0.1;
let tasaInteresFinal = 0.15;
let descuentoAplicado = false;
let cuotasSeleccionadas = 1;
const limitePorProducto = {};

const imagenesProductos = {
    Monitor: './images/monitor.png',
    Celular: './images/celular.png',
    Laptop: './images/laptop.png'
};

class Producto {
    constructor(nombre, precio, descripcion) {
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.cantidad = 1;
    }
}

const mostrarMensaje = (mensaje, tipo) => {
    Swal.fire(mensaje, "", tipo);
};

const guardarCarritoEnLocalStorage = () => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
};

const guardarMontoTotalEnLocalStorage = () => {
    localStorage.setItem('montoTotal', total.toString());
};

const cargarCarritoDesdeLocalStorage = () => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito.push(...JSON.parse(carritoGuardado));
    }
};

const cargarMontoTotalDesdeLocalStorage = () => {
    const montoTotalGuardado = localStorage.getItem('montoTotal');
    if (montoTotalGuardado) {
        total = parseFloat(montoTotalGuardado);
    }
};

const crearElementoHTML = (tipo, atributos = {}, contenido = "") => {
    const elemento = document.createElement(tipo);
    for (const atributo in atributos) {
        elemento.setAttribute(atributo, atributos[atributo]);
    }
    elemento.innerHTML = contenido;
    return elemento;
};

const eliminarDescripcionProducto = (nombre) => {
    const detallesProductosContainer = elementos.detallesProductosContainer;
    const detalleProductos = detallesProductosContainer.getElementsByClassName("detalleProducto");

    for (let i = 0; i < detalleProductos.length; i++) {
        const detalleProducto = detalleProductos[i];
        const nombreProductoDetalle = detalleProducto.querySelector("h3").textContent;

        if (nombreProductoDetalle === nombre) {
            detallesProductosContainer.removeChild(detalleProducto);
            delete productosAgregados[nombre];
            break;
        }
    }

    if (Object.keys(productosAgregados).length === 0) {
        detallesProductosContainer.style.display = "none";
    }
};

const verificarLimitePorTipo = (nombre) => {
    const cantidadEnCarrito = carrito.reduce((total, producto) => {
        if (producto.nombre === nombre) {
            total += producto.cantidad;
        }
        return total;
    }, 0);

    return cantidadEnCarrito < 3;
};

const agregarProductoAlCarrito = (id) => {
    const producto = productos[id];
    if (!producto) {
        mostrarMensaje(`Producto con ID ${id} no encontrado.`, "error");
        return;
    }

    const {
        nombre,
        precio,
        descripcion
    } = producto;

    if (verificarLimitePorTipo(nombre)) {
        if (limitePorProducto[nombre] === undefined || limitePorProducto[nombre] < 3) {
            const productoExistente = carrito.find((producto) => producto.nombre === nombre);

            if (productoExistente) {
                productoExistente.cantidad++;
            } else {
                const nuevoProducto = new Producto(nombre, precio, descripcion);
                carrito.push(nuevoProducto);
            }

            cantidadPorProducto[nombre] = (cantidadPorProducto[nombre] || 0) + 1;

            total += precio;
            actualizarCarrito();
            limitePorProducto[nombre] = (limitePorProducto[nombre] || 0) + 1;

            guardarCarritoEnLocalStorage();
        } else {
            mostrarMensaje(`¡Ya tienes 3 productos de tipo "${nombre}" en tu carrito!`, "warning");
        }
    } else {
        mostrarMensaje(`¡Ya tienes 3 productos de tipo "${nombre}" en tu carrito!`, "warning");
    }

    console.log("Producto agregado:", nombre, "Precio:", precio, "Descripción:", descripcion, "Carrito:", carrito, "Total:", total);

    guardarMontoTotalEnLocalStorage();
};

const eliminarProductoDelCarrito = (nombre) => {
    const productoIndex = carrito.findIndex((producto) => producto.nombre === nombre);

    if (productoIndex !== -1) {
        const precioPorProducto = carrito[productoIndex].precio;
        total -= precioPorProducto;
        carrito[productoIndex].cantidad--;

        cantidadPorProducto[nombre]--;

        if (carrito[productoIndex].cantidad === 0) {
            carrito.splice(productoIndex, 1);
        }

        if (cantidadPorProducto[nombre] === 0) {
            eliminarDescripcionProducto(nombre);
        }

        actualizarCarrito();
        limitePorProducto[nombre]--;
    }
    console.log("Producto eliminado:", nombre, "Carrito:", carrito, "Total:", total);

    guardarCarritoEnLocalStorage();
    guardarMontoTotalEnLocalStorage();
};

const buscarProductoEnCarrito = (nombre) => {
    return carrito.find((producto) => producto.nombre === nombre);
};

const filtrarProductosConDescuento = () => {
    return carrito.filter((producto) => producto.descuento);
};

const calcularTotalEnCuotas = () => {
    const cuotas = cuotasSeleccionadas;
    const totalEnCuotas = calcularTotalConInteres(total, cuotas);

    obtenerValorDolar("Blue")
        .then(valorDolar => {
            if (valorDolar !== null) {
                const totalEnDolares = total / valorDolar;

                elementos.totalElement.textContent = total.toFixed(2);
                elementos.costoCuotaElement.textContent = (totalEnCuotas / cuotas).toFixed(2);
                elementos.totalCuotasElement.textContent = totalEnCuotas.toFixed(2);
                elementos.totalDolarElement.textContent = totalEnDolares.toFixed(2);
            } else {
                mostrarMensaje("Error al obtener el valor del dólar blue.", "error");
            }
        });
};

const calcularCuotas = () => {
    const cuotasValue = parseInt(elementos.cuotasInput.value);

    if (!isNaN(cuotasValue) && cuotasValue > 0) {
        cuotasSeleccionadas = cuotasValue;
        calcularTotalEnCuotas();
    } else {
        mostrarMensaje("Por favor, ingrese un número válido de cuotas.", "error");
        elementos.cuotasInput.value = cuotasSeleccionadas;
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

function obtenerValorDolar(tipoDolar) {
    const url = 'https://api.bluelytics.com.ar/v2/latest';

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                console.error('Error al obtener los datos del dólar');
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                switch (tipoDolar) {
                    case "Blue":
                        if (data.blue && data.blue.value_avg) {
                            return data.blue.value_avg;
                        } else {
                            console.error('No se encontró el valor del dólar blue');
                        }
                        break;
                    case "Oficial":
                        if (data.oficial && data.oficial.value_avg) {
                            return data.oficial.value_avg;
                        } else {
                            console.error('No se encontró el valor del dólar oficial');
                        }
                        break;
                    default:
                        console.error('Tipo de dólar no válido');
                }
            } else {
                console.error('No se encontraron datos del dólar');
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos del dólar:', error);
            return null;
        });
}

const aplicarDescuento = () => {
    if (descuentoAplicado) {
        mostrarMensaje("El código CODER ya ha sido utilizado.", "error");
        return;
    }

    const codigoDescuento = elementos.codigoDescuentoInput.value.trim();
    if (codigoDescuento === "") {
        mostrarMensaje("Por favor, ingrese un código de descuento válido.", "error");
        return;
    }

    if (carrito.length === 0) {
        mostrarMensaje("No hay productos en el carrito para aplicar el descuento.", "error");
        return;
    }

    const mensaje = validarCodigoDescuento(codigoDescuento);

    if (mensaje) {
        mostrarMensaje(mensaje, "error");
        return;
    }

    total *= 0.5;
    descuentoAplicado = true;

    carrito.forEach((producto) => {
        if (producto.nombre.includes("descuento")) {
            producto.descuento = true;
        }
    });

    actualizarCarrito();
    mostrarMensaje("Descuento aplicado con éxito.", "success");

    console.log("Código de descuento aplicado:", codigoDescuento, "Descuento aplicado:", descuentoAplicado, "Total:", total);
};

const validarCodigoDescuento = (codigoDescuento) => {
    return codigoDescuento === "CODER" ? (descuentoAplicado ? "El descuento ya ha sido aplicado." : null) : "Código de descuento no válido";
};

const mostrarAlerta = () => {
    if (descuentoAplicado) {
        mostrarMensaje("Aún no implementado.", "info");

        window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    } else {
        mostrarMensaje("Puedes utilizar el código CODER para obtener un 50% de descuento", "info");
    }
};

const actualizarCarrito = () => {
    const carritoElement = elementos.carritoElement;
    carritoElement.innerHTML = "";

    const detallesProductosContainer = elementos.detallesProductosContainer;
    detallesProductosContainer.innerHTML = "";

    carrito.forEach((producto) => {
        // Detalles
        const detalleProducto = crearElementoHTML("div", {
            class: "detalleProducto"
        });
        detalleProducto.style.width = "332px";
        detalleProducto.style.height = "198px";
        detalleProducto.innerHTML = `
            <h3>${producto.nombre} x${producto.cantidad}</h3>
            <p>Precio total: $${producto.precio * producto.cantidad}</p>
            <p>Descripción: ${producto.descripcion}</p>
        `;
        detallesProductosContainer.appendChild(detalleProducto);
        detallesProductosContainer.style.display = "flex";

        if (imagenesProductos[producto.nombre]) {
            const imagenProducto = crearElementoHTML("img", {
                class: "imagenProducto",
                src: imagenesProductos[producto.nombre],
                alt: producto.nombre
            });
            detalleProducto.appendChild(imagenProducto);
        }

        // Eliminar
        const botonEliminar = crearElementoHTML("button", {
            class: "botonEliminar"
        }, "Eliminar");
        botonEliminar.onclick = () => eliminarProductoDelCarrito(producto.nombre);
        detallesProductosContainer.appendChild(botonEliminar);
    });

    calcularTotalEnCuotas();

    console.log("Carrito actualizado:", carrito, "Total:", total);
};

elementos.botonAgregarMonitor.addEventListener("click", () => agregarProductoAlCarrito(1));
elementos.botonAgregarCelular.addEventListener("click", () => agregarProductoAlCarrito(2));
elementos.botonAgregarLaptop.addEventListener("click", () => agregarProductoAlCarrito(3));
elementos.botonAplicarDescuento.addEventListener("click", () => aplicarDescuento());

elementos.botonPagar.addEventListener("click", () => mostrarAlerta());

const activarBotonEliminarLocalStorage = (mostrar) => {
    const botonEliminarLocalStorage = document.getElementById("botonEliminarLocalStorage");
    if (mostrar) {
        botonEliminarLocalStorage.style.display = "block";
    } else {
        botonEliminarLocalStorage.style.display = "none";
    }
};

const boolModoDebug = () => {
    const checkboxDebug = document.getElementById("checkboxDebug");
    if (checkboxDebug.checked) {
        activarBotonEliminarLocalStorage(true);
    } else {
        activarBotonEliminarLocalStorage(false);
    }
};

const eliminarLocalStorage = () => {
    localStorage.clear();
    carrito.length = 0;
    total = 0;
    actualizarCarrito();
    mostrarMensaje("LocalStorage limpiado correctamente.", "success");
};

document.addEventListener("DOMContentLoaded", () => {
    cargarCarritoDesdeLocalStorage();
    cargarMontoTotalDesdeLocalStorage();
    actualizarCarrito();

    carrito.forEach((producto) => {
        limitePorProducto[producto.nombre] = (limitePorProducto[producto.nombre] || 0) + 1;
    });

    elementos.cuotasInput.onchange = calcularCuotas;

    const labelCheckboxDebug = crearElementoHTML("label", {
        for: "checkboxDebug"
    }, "Activar Debug");
    document.body.appendChild(labelCheckboxDebug);

    const checkboxDebug = crearElementoHTML("input", {
        type: "checkbox",
        id: "checkboxDebug",
        class: "checkboxDebug"
    });
    checkboxDebug.addEventListener("change", boolModoDebug);
    document.body.appendChild(checkboxDebug);

    const botonEliminarLocalStorage = crearElementoHTML("button", {
        id: "botonEliminarLocalStorage",
        class: "botonEliminarLocalStorage",
        style: "display: none; margin-left: 45%"
    }, "Eliminar localStorage");
    botonEliminarLocalStorage.onclick = eliminarLocalStorage;
    document.body.appendChild(botonEliminarLocalStorage);

    console.log("Página cargada y carrito actualizado.");
});