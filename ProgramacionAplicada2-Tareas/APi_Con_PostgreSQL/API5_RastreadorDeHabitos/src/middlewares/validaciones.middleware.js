export const validarHabito = (req, res, next) => {
    const { nombre, meta } = req.body;

    if (!nombre || nombre.trim() === "") {
        return res.status(400).json({ error: "El nombre es un campo requerido" });
    }

    if (!meta || meta.trim() === "") {
        return res.status(400).json({ error: "La meta es un campo requerido" });
    }

    next();
};