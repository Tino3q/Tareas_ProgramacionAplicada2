export const validarTurno = (req, res, next) => {
    const { cliente, servicio } = req.body;

    if (!cliente || cliente.trim() === "") {
        return res.status(400).json({ error: "El cliente es un campo requerido" });
    }

    if (!servicio || servicio.trim() === "") {
        return res.status(400).json({ error: "El servicio es un campo requerido" });
    }

    next();
};