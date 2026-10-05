export const validarProducto = (req, res, next) => {
    const { producto, stock } = req.body;

    if (!producto || producto.trim() === "") {
        return res.status(400).json({ error: "El producto es un campo requerido" });
    }

    if (stock === undefined || typeof stock !== "number" || stock < 0) {
        return res.status(400).json({ error: "El stock debe ser un número no negativo" });
    }

    next();
};

export const validarCantidad = (req, res, next) => {
    const { cantidad } = req.body;

    if (cantidad === undefined || typeof cantidad !== "number" || cantidad <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser un número positivo" });
    }

    next();
};