const express = require("express");

const app = express();
app.use(express.json());

let encuestas = [];
let siguienteId = 1;

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

function validarEncuesta(req, res, next) {
    const { pregunta, opciones } = req.body;

    if (!pregunta || !Array.isArray(opciones) || opciones.length < 2) {
        return res.status(400).json({
            mensaje: "La encuesta necesita una pregunta y mínimo 2 opciones"
        });
    }

    next();
}

app.post("/encuestas", validarEncuesta, (req, res) => {
    const encuesta = {
        id: siguienteId,
        pregunta: req.body.pregunta,
        opciones: req.body.opciones.map(nombre => ({
            nombre,
            votos: 0
        }))
    };

    encuestas.push(encuesta);
    siguienteId++;

    res.status(201).json(encuesta);
});

app.get("/encuestas", (req, res) => {
    res.json(encuestas);
});

app.post("/encuestas/:id/votar", (req, res) => {
    const id = Number(req.params.id);
    const encuesta = encuestas.find(e => e.id === id);

    if (!encuesta) {
        return res.status(404).json({
            mensaje: "Encuesta no encontrada"
        });
    }

    const { opcion } = req.body;

    if (!opcion) {
        return res.status(400).json({
            mensaje: "Debe indicar una opción"
        });
    }

    const seleccion = encuesta.opciones.find(o => o.nombre === opcion);

    if (!seleccion) {
        return res.status(400).json({
            mensaje: "La opción no existe"
        });
    }

    seleccion.votos++;

    res.json({
        mensaje: "Voto registrado"
    });
});

app.get("/encuestas/:id/resultados", (req, res) => {
    const id = Number(req.params.id);
    const encuesta = encuestas.find(e => e.id === id);

    if (!encuesta) {
        return res.status(404).json({
            mensaje: "Encuesta no encontrada"
        });
    }

    let totalVotos = 0;

    encuesta.opciones.forEach(o => {
        totalVotos += o.votos;
    });

    const resultados = encuesta.opciones.map(o => ({
        opcion: o.nombre,
        votos: o.votos,
        porcentaje: totalVotos === 0 ? 0 : (o.votos / totalVotos) * 100
    }));

    let ganador = encuesta.opciones[0];

    encuesta.opciones.forEach(o => {
        if (o.votos > ganador.votos) {
            ganador = o;
        }
    });

    res.json({
        resultados,
        ganador: ganador.nombre
    });
});

app.delete("/encuestas/:id", (req, res) => {
    const id = Number(req.params.id);
    const encuesta = encuestas.find(e => e.id === id);

    if (!encuesta) {
        return res.status(404).json({
            mensaje: "Encuesta no encontrada"
        });
    }

    encuestas = encuestas.filter(e => e.id !== id);

    res.json({
        mensaje: "Encuesta eliminada"
    });
});

app.listen(3001, () => {
    console.log("API Votación funcionando");
});