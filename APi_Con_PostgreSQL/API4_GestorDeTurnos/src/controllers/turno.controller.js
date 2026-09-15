import { prisma } from "../db.js";

export const crearTurno = async (req, res) => {
    try {
        const { cliente, servicio } = req.body;

        const turno = await prisma.turno.create({
            data: { cliente, servicio }
        });

        res.status(201).json(turno);
    } catch (error) {
        console.error("Error al crear turno:", error);
        res.status(500).json({ error: "Error interno del servidor al crear el turno" });
    }
};

export const obtenerTurnos = async (req, res) => {
    try {
        const turnos = await prisma.turno.findMany();
        res.json(turnos);
    } catch (error) {
        console.error("Error al obtener turnos:", error);
        res.status(500).json({ error: "Error interno del servidor al consultar los turnos" });
    }
};

export const siguiente = async (req, res) => {
    try {
        const turno = await prisma.turno.findFirst({
            where: { estado: "esperando" },
            orderBy: { id: "asc" }
        });

        if (!turno) {
            return res.status(404).json({ error: "No hay turnos en espera" });
        }

        res.json(turno);
    } catch (error) {
        console.error("Error al obtener siguiente turno:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener el siguiente turno" });
    }
};

export const llamar = async (req, res) => {
    try {
        const enAtencion = await prisma.turno.findFirst({
            where: { estado: "atendiendo" }
        });

        if (enAtencion) {
            return res.status(400).json({ error: "Ya hay un turno siendo atendido" });
        }

        const siguiente = await prisma.turno.findFirst({
            where: { estado: "esperando" },
            orderBy: { id: "asc" }
        });

        if (!siguiente) {
            return res.status(404).json({ error: "No hay turnos en espera" });
        }

        const turno = await prisma.turno.update({
            where: { id: siguiente.id },
            data: { estado: "atendiendo" }
        });

        res.json(turno);
    } catch (error) {
        console.error("Error al llamar turno:", error);
        res.status(500).json({ error: "Error interno del servidor al llamar el turno" });
    }
};

export const finalizar = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "El parámetro ID debe ser un número entero válido" });
        }

        const turno = await prisma.turno.findUnique({ where: { id } });

        if (!turno) {
            return res.status(404).json({ error: "Turno no encontrado" });
        }

        const actualizado = await prisma.turno.update({
            where: { id },
            data: { estado: "finalizado" }
        });

        res.json(actualizado);
    } catch (error) {
        console.error("Error al finalizar turno:", error);
        res.status(500).json({ error: "Error interno del servidor al finalizar el turno" });
    }
};

export const enEspera = async (req, res) => {
    try {
        const cantidad = await prisma.turno.count({
            where: { estado: "esperando" }
        });

        res.json({ enEspera: cantidad });
    } catch (error) {
        console.error("Error al contar turnos en espera:", error);
        res.status(500).json({ error: "Error interno del servidor al contar los turnos en espera" });
    }
};