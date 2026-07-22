// ==========================================
// ESTADO
// ==========================================
let tipoActual = "peliculas"; // "peliculas" | "series"
let items = [];
let idEnEdicion = null;

// ==========================================
// REFERENCIAS DOM
// ==========================================
const grid = document.getElementById("grid");
const contador = document.getElementById("contador");
const buscador = document.getElementById("buscador");
const tabs = document.querySelectorAll(".nav__tab");

const modalFondo = document.getElementById("modalFondo");
const modalTitulo = document.getElementById("modalTitulo");
const formulario = document.getElementById("formulario");
const errorMsg = document.getElementById("errorMsg");
const toast = document.getElementById("toast");

const campoDuracion = document.querySelector(".campo-pelicula");
const campoSerie = document.querySelector(".campo-serie");

// ==========================================
// PALETA DE POSTERS (gradientes fijos, look editorial de catálogo)
// ==========================================
const GRADIENTES = [
    "linear-gradient(150deg, #7a1620 0%, #2b0a10 100%)",
    "linear-gradient(150deg, #1f2a52 0%, #0a0e21 100%)",
    "linear-gradient(150deg, #5c3a11 0%, #1c1204 100%)",
    "linear-gradient(150deg, #234d3b 0%, #08150f 100%)",
    "linear-gradient(150deg, #4a1e5c 0%, #150819 100%)",
    "linear-gradient(150deg, #7a4a12 0%, #241503 100%)",
    "linear-gradient(150deg, #1e5c58 0%, #071b19 100%)",
    "linear-gradient(150deg, #5c1e3f 0%, #190712 100%)"
];

function gradientePara(texto) {
    let hash = 0;
    for (let i = 0; i < texto.length; i++) {
        hash = texto.charCodeAt(i) + ((hash << 5) - hash);
    }
    const indice = Math.abs(hash) % GRADIENTES.length;
    return GRADIENTES[indice];
}

// ==========================================
// TOAST
// ==========================================
let toastTimeout;
function mostrarToast(mensaje, esError = false) {
    clearTimeout(toastTimeout);
    toast.textContent = mensaje;
    toast.classList.toggle("error", esError);
    toast.classList.add("visible");
    toastTimeout = setTimeout(() => toast.classList.remove("visible"), 3000);
}

// ==========================================
// CARGA Y RENDER
// ==========================================
async function cargarCatalogo() {
    grid.innerHTML = `<div class="estado"><p class="estado__titulo">Cargando...</p></div>`;

    try {
        items = tipoActual === "peliculas"
            ? await obtenerPeliculas()
            : await obtenerSeries();

        renderizar();
    } catch (error) {
        grid.innerHTML = `<div class="estado">
            <p class="estado__titulo">No se pudo cargar el catálogo</p>
            <p>${error.message}</p>
        </div>`;
    }
}

function renderizar() {
    const filtro = buscador.value.trim().toLowerCase();

    const filtrados = items.filter((item) =>
        item.titulo.toLowerCase().includes(filtro) ||
        item.genero.toLowerCase().includes(filtro)
    );

    contador.textContent = `${filtrados.length} título${filtrados.length === 1 ? "" : "s"}`;

    if (filtrados.length === 0) {
        grid.innerHTML = `<div class="estado">
            <p class="estado__titulo">Nada por aquí</p>
            <p>${items.length === 0 ? "Agrega tu primer título con el botón de arriba." : "No hay resultados para tu búsqueda."}</p>
        </div>`;
        return;
    }

    grid.innerHTML = filtrados.map((item) => tarjetaHTML(item)).join("");

    // Listeners de acciones (delegación simple tras render)
    grid.querySelectorAll("[data-editar]").forEach((btn) => {
        btn.addEventListener("click", () => abrirModalEdicion(btn.dataset.editar));
    });
    grid.querySelectorAll("[data-eliminar]").forEach((btn) => {
        btn.addEventListener("click", () => confirmarEliminar(btn.dataset.eliminar));
    });
}

function tarjetaHTML(item) {
    const metaExtra = tipoActual === "peliculas"
        ? `<span class="poster__badge">${item.duracion} min</span>`
        : `<span class="poster__badge">${item.temporadas} temp · ${item.episodios} ep</span>`;

    return `
    <article class="poster" style="background:${gradientePara(item.titulo)}">
        <span class="poster__nc">${item.nc}</span>
        <div class="poster__fondo">
            <p class="poster__titulo">${item.titulo}</p>
        </div>
        <div class="poster__overlay">
            <div class="poster__meta">
                <span class="poster__badge">${item.genero}</span>
                <span class="poster__badge">${item.año}</span>
                <span class="poster__badge">${item.idioma}</span>
                ${metaExtra}
            </div>
            <p class="poster__calif">★ ${item.calificacion}</p>
            <div class="poster__acciones">
                <button class="poster__btn poster__btn--editar" data-editar="${item._id}">Editar</button>
                <button class="poster__btn poster__btn--eliminar" data-eliminar="${item._id}">Eliminar</button>
            </div>
        </div>
    </article>`;
}

// ==========================================
// TABS
// ==========================================
tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        if (tab.dataset.tipo === tipoActual) return;

        tabs.forEach((t) => t.classList.remove("activo"));
        tab.classList.add("activo");
        tipoActual = tab.dataset.tipo;
        buscador.value = "";
        actualizarCamposFormulario();
        cargarCatalogo();
    });
});

buscador.addEventListener("input", renderizar);

// ==========================================
// MODAL: abrir / cerrar
// ==========================================
function actualizarCamposFormulario() {
    const esPelicula = tipoActual === "peliculas";
    campoDuracion.style.display = esPelicula ? "block" : "none";
    campoSerie.style.display = esPelicula ? "none" : "grid";

    document.getElementById("duracion").required = esPelicula;
    document.getElementById("temporadas").required = !esPelicula;
    document.getElementById("episodios").required = !esPelicula;
}

function abrirModalAgregar() {
    idEnEdicion = null;
    formulario.reset();
    ocultarError();
    modalTitulo.textContent = tipoActual === "peliculas" ? "Agregar película" : "Agregar serie";
    actualizarCamposFormulario();
    modalFondo.hidden = false;
}

function abrirModalEdicion(id) {
    const item = items.find((i) => i._id === id);
    if (!item) return;

    idEnEdicion = id;
    ocultarError();
    actualizarCamposFormulario();

    document.getElementById("titulo").value = item.titulo;
    document.getElementById("genero").value = item.genero;
    document.getElementById("anio").value = item.año;
    document.getElementById("idioma").value = item.idioma;
    document.getElementById("calificacion").value = item.calificacion;
    document.getElementById("nc").value = item.nc;

    if (tipoActual === "peliculas") {
        document.getElementById("duracion").value = item.duracion;
    } else {
        document.getElementById("temporadas").value = item.temporadas;
        document.getElementById("episodios").value = item.episodios;
    }

    modalTitulo.textContent = tipoActual === "peliculas" ? "Editar película" : "Editar serie";
    modalFondo.hidden = false;
}

function cerrarModal() {
    modalFondo.hidden = true;
    formulario.reset();
    ocultarError();
}

function mostrarError(mensaje) {
    errorMsg.textContent = mensaje;
    errorMsg.classList.add("visible");
}
function ocultarError() {
    errorMsg.classList.remove("visible");
}

document.getElementById("btnAbrirModal").addEventListener("click", abrirModalAgregar);
document.getElementById("btnCerrarModal").addEventListener("click", cerrarModal);
document.getElementById("btnCancelar").addEventListener("click", cerrarModal);
modalFondo.addEventListener("click", (e) => {
    if (e.target === modalFondo) cerrarModal();
});

// ==========================================
// GUARDAR (crear o actualizar)
// ==========================================
formulario.addEventListener("submit", async (e) => {
    e.preventDefault();
    ocultarError();

    const datosBase = {
        titulo: document.getElementById("titulo").value.trim(),
        genero: document.getElementById("genero").value.trim(),
        año: Number(document.getElementById("anio").value),
        idioma: document.getElementById("idioma").value.trim(),
        calificacion: Number(document.getElementById("calificacion").value),
        nc: document.getElementById("nc").value.trim()
    };

    const datos = tipoActual === "peliculas"
        ? { ...datosBase, duracion: Number(document.getElementById("duracion").value) }
        : {
            ...datosBase,
            temporadas: Number(document.getElementById("temporadas").value),
            episodios: Number(document.getElementById("episodios").value)
        };

    const btnGuardar = document.getElementById("btnGuardar");
    btnGuardar.disabled = true;
    btnGuardar.textContent = "Guardando...";

    try {
        if (idEnEdicion) {
            await (tipoActual === "peliculas"
                ? actualizarPelicula(idEnEdicion, datos)
                : actualizarSerie(idEnEdicion, datos));
            mostrarToast("Actualizado correctamente");
        } else {
            await (tipoActual === "peliculas"
                ? agregarPelicula(datos)
                : agregarSerie(datos));
            mostrarToast("Agregado correctamente");
        }

        cerrarModal();
        await cargarCatalogo();
    } catch (error) {
        mostrarError(error.message);
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = "Guardar";
    }
});

// ==========================================
// ELIMINAR
// ==========================================
async function confirmarEliminar(id) {
    const item = items.find((i) => i._id === id);
    if (!item) return;

    const confirmado = confirm(`¿Eliminar "${item.titulo}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    try {
        await (tipoActual === "peliculas" ? eliminarPelicula(id) : eliminarSerie(id));
        mostrarToast("Eliminado correctamente");
        await cargarCatalogo();
    } catch (error) {
        mostrarToast(error.message, true);
    }
}

// ==========================================
// INICIO
// ==========================================
actualizarCamposFormulario();
cargarCatalogo();