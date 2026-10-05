import { prisma } from "../db.js";

export const calcularTotal = async (req, res) => {
    try {
        const productos = await prisma.producto.findMany();
        const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

        res.json({ total });
    } catch (error) {
        console.error("Error al calcular total:", error);
        res.status(500).json({ error: "Error interno del servidor al calcular el total" });
    }
};

export const aplicarDescuento = async (req, res) => {
    try {
        const { porcentaje } = req.body;
        const productos = await prisma.producto.findMany();

        const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
        const descuento = total * (porcentaje / 100);
        const totalConDescuento = total - descuento;

        res.json({ total, porcentaje, descuento, totalConDescuento });
    } catch (error) {
        console.error("Error al aplicar descuento:", error);
        res.status(500).json({ error: "Error interno del servidor al aplicar el descuento" });
    }
};