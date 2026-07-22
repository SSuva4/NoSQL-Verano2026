// ==========================================
// CONFIGURACIÓN
// ==========================================
// Como esta página (index.html) y la API viven en el MISMO proyecto de Vercel,
// las peticiones se hacen a la misma dirección desde la que se sirve la página.
// Por eso API_URL queda vacío: fetch(`${API_URL}/peliculas`) termina siendo
// simplemente fetch("/peliculas"), y el navegador nunca ve un origen distinto,
// así que no hace falta configurar CORS.
//
// Esto funciona igual en local: corre "npm start" y abre http://localhost:3003
// (NO abras index.html con doble clic, ábrelo desde esa URL del servidor).
const API_URL = "https://api-netflix-vert.vercel.app/";

async function manejarRespuesta(respuesta, mensajeError) {
    let cuerpo = null;
    try {
        cuerpo = await respuesta.json();
    } catch (_) {
        // la respuesta no traía JSON (poco probable, pero no debe tronar)
    }

    if (!respuesta.ok) {
        const detalle = cuerpo?.mensaje || mensajeError;
        throw new Error(detalle);
    }

    return cuerpo;
}

// ==========================================
// PELÍCULAS
// ==========================================

async function obtenerPeliculas() {
    const respuesta = await fetch(`${API_URL}/peliculas`);
    return manejarRespuesta(respuesta, "Error al consultar las películas");
}

async function agregarPelicula(pelicula) {
    const respuesta = await fetch(`${API_URL}/peliculas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pelicula)
    });
    return manejarRespuesta(respuesta, "Error al guardar la película");
}

async function actualizarPelicula(id, pelicula) {
    const respuesta = await fetch(`${API_URL}/peliculas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pelicula)
    });
    return manejarRespuesta(respuesta, "Error al actualizar la película");
}

async function eliminarPelicula(id) {
    const respuesta = await fetch(`${API_URL}/peliculas/${id}`, {
        method: "DELETE"
    });
    return manejarRespuesta(respuesta, "Error al eliminar la película");
}

// ==========================================
// SERIES
// ==========================================

async function obtenerSeries() {
    const respuesta = await fetch(`${API_URL}/series`);
    return manejarRespuesta(respuesta, "Error al consultar las series");
}

async function agregarSerie(serie) {
    const respuesta = await fetch(`${API_URL}/series`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serie)
    });
    return manejarRespuesta(respuesta, "Error al guardar la serie");
}

async function actualizarSerie(id, serie) {
    const respuesta = await fetch(`${API_URL}/series/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serie)
    });
    return manejarRespuesta(respuesta, "Error al actualizar la serie");
}

async function eliminarSerie(id) {
    const respuesta = await fetch(`${API_URL}/series/${id}`, {
        method: "DELETE"
    });
    return manejarRespuesta(respuesta, "Error al eliminar la serie");
}
