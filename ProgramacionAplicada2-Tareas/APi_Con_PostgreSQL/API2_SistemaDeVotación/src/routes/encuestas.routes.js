import { prisma } from "../db.js";

export const crearEncuesta = async (req, res) => {
    try {
        const { pregunta, opciones } = req.body;

        const encuesta = await prisma.encuesta.create({
            data: {
                pregunta,
                opciones: {
                    create: opciones.map((texto) => ({ texto }))
                }
            },
            include: { opciones: true }
        });

        res.status(201).json(encuesta);
    } catch (error) {
        console.error("Error al crear encuesta:", error);
        res.status(500).json({ error: "Error interno del servidor al crear la encuesta" });
    }
};

export const obtenerEncuestas = async (req, res) => {
    try {
        const encuestas = await prisma.encuesta.findMany({
            include: { opciones: true }
        });
        res.json(encuestas);
    } catch (error) {
        console.error("Error al obtener encuestas:", error);
        res.status(500).json({ error: "Error interno del servidor al consultar las encuestas" });
    }
};

export const votar = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "El parámetro ID debe ser un número entero válido" });
        }

        const encuesta = await prisma.encuesta.findUnique({
            where: { id },
            include: { opciones: true }
        });

        if (!encuesta) {
            return res.status(404).json({ error: "Encuesta no encontrada" });
        }

        const { opcion } = req.body;

        const opcionEncontrada = encuesta.opciones.find(
            (o) => o.texto.toLowerCase() === opcion.toLowerCase()
        );

        if (!opcionEncontrada) {
            return res.status(400).json({ error: "La opción no existe en esta encuesta" });
        }

        const opcionActualizada = await prisma.opcion.update({
            where: { id: opcionEncontrada.id },
            data: { votos: opcionEncontrada.votos + 1 }
        });

        res.json(opcionActualizada);
    } catch (error) {
        console.error("Error al votar:", error);
        res.status(500).json({ error: "Error interno del servidor al registrar el voto" });
    }
};

export const obtenerResultados = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "El parámetro ID debe ser un número entero válido" });
        }

        const encuesta = await prisma.encuesta.findUnique({
            where: { id },
            include: { opciones: true }
        });

        if (!encuesta) {
            return res.status(404).json({ error: "Encuesta no encontrada" });
        }

        const totalVotos = encuesta.opciones.reduce((acc, o) => acc + o.votos, 0);

        const resultados = encuesta.opciones.map((o) => ({
            opcion: o.texto,
            votos: o.votos,
            porcentaje: totalVotos > 0 ? ((o.votos / totalVotos) * 100).toFixed(2) + "%" : "0%"
        }));

        const ganador = encuesta.opciones.reduce((a, b) => (a.votos >= b.votos ? a : b));

        res.json({ pregunta: encuesta.pregunta, totalVotos, resultados, ganador: ganador.texto });
    } catch (error) {
        console.error("Error al obtener resultados:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los resultados" });
    }
};

export const eliminarEncuesta = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "El parámetro ID debe ser un número entero válido" });
        }

        const encuesta = await prisma.encuesta.findUnique({ where: { id } });

        if (!encuesta) {
            return res.status(404).json({ error: "Encuesta no encontrada" });
        }

        await prisma.encuesta.delete({ where: { id } });

        res.json({ mensaje: "Eliminada" });
    } catch (error) {
        console.error("Error al eliminar encuesta:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar la encuesta" });
    }
};
