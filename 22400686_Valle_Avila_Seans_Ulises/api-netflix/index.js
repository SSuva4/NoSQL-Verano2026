const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Forzar uso de DNS de Google
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3003;
const morgan = require('morgan');
const mongoose = require('mongoose');

// Middlewares
app.use(cors()); // <-- IMPORTANTE: sin esto, el navegador bloquea las peticiones
                  // del frontend (hosteado en otro dominio) por política CORS.
app.use(express.json());
app.use(morgan('dev'));

// Conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://grupo:grupo@servidorprueba.ygegryf.mongodb.net/netflix')
.then(() => {
    console.log("Conectado correctamente a la base de datos 'netflix'");
})
.catch((error) => {
    console.error("Error al conectar con MongoDB:", error);
});

// ==========================================
// SCHEMAS Y MODELOS
// ==========================================

// Schema Películas
const peliculaSchema = new mongoose.Schema({
    titulo: { type: String, required: true, trim: true },
    genero: { type: String, required: true, trim: true },
    año: { type: Number, required: true },
    duracion: { type: Number, required: true },
    idioma: { type: String, required: true, trim: true },
    calificacion: { type: Number, required: true },
    nc: { type: String, required: true, trim: true }
}, { timestamps: true });

const Pelicula = mongoose.model("Pelicula", peliculaSchema, "peliculas");

// Schema Series
const serieSchema = new mongoose.Schema({
    titulo: { type: String, required: true, trim: true },
    genero: { type: String, required: true, trim: true },
    año: { type: Number, required: true },
    temporadas: { type: Number, required: true },
    episodios: { type: Number, required: true },
    idioma: { type: String, required: true, trim: true },
    calificacion: { type: Number, required: true },
    nc: { type: String, required: true, trim: true }
}, { timestamps: true });

const Serie = mongoose.model("Serie", serieSchema, "series");

// ==========================================
// ENDPOINTS DE PELÍCULAS (CRUD)
// ==========================================

app.get("/peliculas", async (req, res) => {
    try {
        const peliculas = await Pelicula.find();
        res.json(peliculas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las películas", error });
    }
});

app.get("/peliculas/:id", async (req, res) => {
    try {
        const pelicula = await Pelicula.findById(req.params.id);
        if (!pelicula) {
            return res.status(404).json({ mensaje: "Película no encontrada" });
        }
        res.json(pelicula);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la película", error });
    }
});

app.post("/peliculas", async (req, res) => {
    try {
        const { titulo, genero, año, duracion, idioma, calificacion, nc } = req.body;

        if (!titulo || !genero || !año || !duracion || !idioma || calificacion === undefined || !nc) {
            return res.status(400).json({ mensaje: "Faltan datos obligatorios de la película" });
        }

        const nuevaPelicula = new Pelicula({ titulo, genero, año, duracion, idioma, calificacion, nc });
        const peliculaGuardada = await nuevaPelicula.save();

        res.status(201).json({
            mensaje: "Película registrada correctamente",
            pelicula: peliculaGuardada
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar la película", error });
    }
});

app.put("/peliculas/:id", async (req, res) => {
    try {
        const { titulo, genero, año, duracion, idioma, calificacion, nc } = req.body;

        const peliculaActualizada = await Pelicula.findByIdAndUpdate(
            req.params.id,
            { titulo, genero, año, duracion, idioma, calificacion, nc },
            { new: true, runValidators: true }
        );

        if (!peliculaActualizada) {
            return res.status(404).json({ mensaje: "Película no encontrada" });
        }

        res.json({
            mensaje: "Película actualizada correctamente",
            pelicula: peliculaActualizada
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar la película", error });
    }
});

app.delete("/peliculas/:id", async (req, res) => {
    try {
        const peliculaEliminada = await Pelicula.findByIdAndDelete(req.params.id);

        if (!peliculaEliminada) {
            return res.status(404).json({ mensaje: "Película no encontrada" });
        }

        res.json({
            mensaje: "Película eliminada correctamente",
            pelicula: peliculaEliminada
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar la película", error });
    }
});

// ==========================================
// ENDPOINTS DE SERIES (CRUD)
// ==========================================

app.get("/series", async (req, res) => {
    try {
        const series = await Serie.find();
        res.json(series);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las series", error });
    }
});

app.get("/series/:id", async (req, res) => {
    try {
        const serie = await Serie.findById(req.params.id);
        if (!serie) {
            return res.status(404).json({ mensaje: "Serie no encontrada" });
        }
        res.json(serie);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la serie", error });
    }
});

app.post("/series", async (req, res) => {
    try {
        const { titulo, genero, año, temporadas, episodios, idioma, calificacion, nc } = req.body;

        if (!titulo || !genero || !año || !temporadas || !episodios || !idioma || calificacion === undefined || !nc) {
            return res.status(400).json({ mensaje: "Faltan datos obligatorios de la serie" });
        }

        const nuevaSerie = new Serie({ titulo, genero, año, temporadas, episodios, idioma, calificacion, nc });
        const serieGuardada = await nuevaSerie.save();

        res.status(201).json({
            mensaje: "Serie registrada correctamente",
            serie: serieGuardada
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar la serie", error });
    }
});

app.put("/series/:id", async (req, res) => {
    try {
        const { titulo, genero, año, temporadas, episodios, idioma, calificacion, nc } = req.body;

        const serieActualizada = await Serie.findByIdAndUpdate(
            req.params.id,
            { titulo, genero, año, temporadas, episodios, idioma, calificacion, nc },
            { new: true, runValidators: true }
        );

        if (!serieActualizada) {
            return res.status(404).json({ mensaje: "Serie no encontrada" });
        }

        res.json({
            mensaje: "Serie actualizada correctamente",
            serie: serieActualizada
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar la serie", error });
    }
});

app.delete("/series/:id", async (req, res) => {
    try {
        const serieEliminada = await Serie.findByIdAndDelete(req.params.id);

        if (!serieEliminada) {
            return res.status(404).json({ mensaje: "Serie no encontrada" });
        }

        res.json({
            mensaje: "Serie eliminada correctamente",
            serie: serieEliminada
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar la serie", error });
    }
});

// ==========================================
// RUTA INICIAL
// ==========================================
app.get('/', (req, res) => {
    res.send('¡API de Netflix funcionando correctamente!');
});

// Servidor
app.listen(PORT, () => {
    console.log("Servidor iniciado en: http://localhost:" + PORT);
});

module.exports = app; // <-- útil si despliegas en Vercel como función serverless