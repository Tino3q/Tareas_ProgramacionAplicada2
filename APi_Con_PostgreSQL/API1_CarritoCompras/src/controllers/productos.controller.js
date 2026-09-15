import { prisma } from "../db.js";

export const obtenerProductos = async (req, res) => {
    try {
        const productos = await prisma.producto.findMany();
        res.json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error interno del servidor al consultar los productos" });
    }
};

export const agregarProducto = async (req, res) => {
    try {
        const { nombre, precio, cantidad } = req.body;

        const existente = await prisma.producto.findUnique({
            where: { nombre }
        });

        if (existente) {
            const actualizado = await prisma.producto.update({
                where: { nombre },
                data: { cantidad: existente.cantidad + cantidad }
            });
            return res.json(actualizado);
        }

        const producto = await prisma.producto.create({
            data: { nombre, precio, cantidad }
        });

        res.status(201).json(producto);
    } catch (error) {
        console.error("Error al agregar producto:", error);
        res.status(500).json({ error: "Error interno del servidor al agregar el producto" });
    }
};

export const actualizarCantidad = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "El parámetro ID debe ser un número entero válido" });
        }

        const existe = await prisma.producto.findUnique({ where: { id } });

        if (!existe) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const { cantidad } = req.body;

        const producto = await prisma.producto.update({
            where: { id },
            data: { cantidad }
        });

        res.json(producto);
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ error: "Error interno del servidor al actualizar el producto" });
    }
};

export const eliminarProducto = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "El parámetro ID debe ser un número entero válido" });
        }

        const existe = await prisma.producto.findUnique({ where: { id } });

        if (!existe) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        await prisma.producto.delete({ where: { id } });

        res.json({ mensaje: "Eliminado" });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar el producto" });
    }
};