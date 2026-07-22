// ==========================================
// CONFIGURACIÓN
// ==========================================
// Reemplaza esto con la URL real de tu API desplegada en Vercel,
// por ejemplo: "https://tu-proyecto.vercel.app"
// Para probar en local mientras desarrollas, usa: "http://localhost:3003"
const API_URL = "URL_VERCEL";

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