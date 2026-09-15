import { prisma } from "../db.js";

export const listarInventario = async (req, res) => {
    try {
        const items = await prisma.inventario.findMany();
        res.json(items);
    } catch (error) {
        console.error("Error al listar inventario:", error);
        res.status(500).json({ error: "Error interno del servidor al consultar el inventario" });
    }
};

export const crearProducto = async (req, res) => {
    try {
        const { producto, stock, stockMinimo } = req.body;

        const item = await prisma.inventario.create({
            data: {
                producto,
                stock,
                stockMinimo: stockMinimo ?? 5
            }
        });

        res.status(201).json(item);
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ error: "Error interno del servidor al crear el producto" });
    }
};

export const entrada = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "El parámetro ID debe ser un número entero válido" });
        }

        const item = await prisma.inventario.findUnique({ where: { id } });

        if (!item) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const { cantidad } = req.body;

        const actualizado = await prisma.inventario.update({
            where: { id },
            data: { stock: item.stock + cantidad }
        });

        res.json(actualizado);
    } catch (error) {
        console.error("Error al registrar entrada:", error);
        res.status(500).json({ error: "Error interno del servidor al registrar la entrada" });
    }
};

export const salida = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "El parámetro ID debe ser un número entero válido" });
        }

        const item = await prisma.inventario.findUnique({ where: { id } });

        if (!item) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const { cantidad } = req.body;

        if (cantidad > item.stock) {
            return res.status(400).json({ error: "La cantidad supera el stock disponible" });
        }

        const actualizado = await prisma.inventario.update({
            where: { id },
            data: { stock: item.stock - cantidad }
        });

        res.json(actualizado);
    } catch (error) {
        console.error("Error al registrar salida:", error);
        res.status(500).json({ error: "Error interno del servidor al registrar la salida" });
    }
};

export const alertas = async (req, res) => {
    try {
        const todos = await prisma.inventario.findMany();
        const bajoMinimo = todos
            .filter((i) => i.stock < i.stockMinimo)
            .map((i) => ({
                ...i,
                faltante: i.stockMinimo - i.stock
            }));

        res.json(bajoMinimo);
    } catch (error) {
        console.error("Error al obtener alertas:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener las alertas" });
    }
};