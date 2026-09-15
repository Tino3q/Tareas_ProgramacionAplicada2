export const validarEncuesta = (req, res, next) => {
    const { pregunta, opciones } = req.body;

    if (!pregunta || pregunta.trim() === "") {
        return res.status(400).json({ error: "La pregunta es un campo requerido" });
    }

    if (!Array.isArray(opciones) || opciones.length < 2) {
        return res.status(400).json({ error: "Se requieren mínimo 2 opciones" });
    }

    next();
};

export const validarVoto = (req, res, next) => {
    const { opcion } = req.body;

    if (!opcion || opcion.trim() === "") {
        return res.status(400).json({ error: "La opcion es un campo requerido" });
    }

    next();
};