import { prisma } from "../db.js";

export const crearHabito = async (req, res) => {
    try {
        const { nombre, meta } = req.body;

        const habito = await prisma.habito.create({
            data: { nombre, meta }
        });

        res.status(201).json(habito);
    } catch (error) {
        console.error("Error al crear hábito:", error);
        res.status(500).json({ error: "Error interno del servidor al crear el hábito" });
    }
};

export const obtenerHabitos = async (req, res) => {
    try {
        const habitos = await prisma.habito.findMany({
            include: { registros: true }
        });
        res.json(habitos);
    } catch (error) {
        console.error("Error al obtener hábitos:", error);
        res.status(500).json({ error: "Error interno del servidor al consultar los hábitos" });
    }
};

export const registrarHabito = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "El parámetro ID debe ser un número entero válido" });
        }

        const habito = await prisma.habito.findUnique({
            where: { id },
            include: { registros: true }
        });

        if (!habito) {
            return res.status(404).json({ error: "Hábito no encontrado" });
        }

        const hoy = new Date().toISOString().split("T")[0];

        const yaRegistrado = habito.registros.find((r) => r.fecha === hoy);

        if (yaRegistrado) {
            return res.status(400).json({ error: "El hábito ya fue registrado hoy" });
        }

        const registro = await prisma.registro.create({
            data: { fecha: hoy, habitoId: id }
        });

        res.status(201).json(registro);
    } catch (error) {
        console.error("Error al registrar hábito:", error);
        res.status(500).json({ error: "Error interno del servidor al registrar el hábito" });
    }
};

export const estadisticas = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "El parámetro ID debe ser un número entero válido" });
        }

        const habito = await prisma.habito.findUnique({
            where: { id },
            include: { registros: { orderBy: { fecha: "asc" } } }
        });

        if (!habito) {
            return res.status(404).json({ error: "Hábito no encontrado" });
        }

        const fechas = habito.registros.map((r) => r.fecha);
        const total = fechas.length;

        let rachaActual = 0;
        let mejorRacha = 0;
        let contadorTemp = 0;

        const hoy = new Date();

        for (let i = 0; i < total; i++) {
            if (i === 0) {
                contadorTemp = 1;
            } else {
                const anterior = new Date(fechas[i - 1]);
                const actual = new Date(fechas[i]);
                const diff = (actual - anterior) / (1000 * 60 * 60 * 24);

                if (diff === 1) {
                    contadorTemp++;
                } else {
                    contadorTemp = 1;
                }
            }

            if (contadorTemp > mejorRacha) mejorRacha = contadorTemp;
        }

        if (total > 0) {
            const ultima = new Date(fechas[total - 1]);
            const diffHoy = (hoy - ultima) / (1000 * 60 * 60 * 24);
            rachaActual = diffHoy <= 1 ? contadorTemp : 0;
        }

        const primerRegistro = total > 0 ? new Date(fechas[0]) : hoy;
        const diasDesdeInicio = Math.floor((hoy - primerRegistro) / (1000 * 60 * 60 * 24)) + 1;
        const porcentaje = total > 0 ? ((total / diasDesdeInicio) * 100).toFixed(2) + "%" : "0%";

        res.json({ rachaActual, mejorRacha, porcentaje });
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener las estadísticas" });
    }
};

export const eliminarHabito = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "El parámetro ID debe ser un número entero válido" });
        }

        const habito = await prisma.habito.findUnique({ where: { id } });

        if (!habito) {
            return res.status(404).json({ error: "Hábito no encontrado" });
        }

        await prisma.habito.delete({ where: { id } });

        res.json({ mensaje: "Eliminado" });
    } catch (error) {
        console.error("Error al eliminar hábito:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar el hábito" });
    }
};