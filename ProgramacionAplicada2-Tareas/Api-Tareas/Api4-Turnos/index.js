const express = require("express");

const app = express();
app.use(express.json());

let turnos = [];
let siguienteId = 1;

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

function validarTurno(req, res, next) {
    const { cliente, servicio } = req.body;

    if (!cliente || !servicio) {
        return res.status(400).json({
            mensaje: "Cliente y servicio son requeridos"
        });
    }

    next();
}

app.post("/turnos", validarTurno, (req, res) => {
    const turno = {
        id: siguienteId,
        cliente: req.body.cliente,
        servicio: req.body.servicio,
        estado: "esperando"
    };

    turnos.push(turno);
    siguienteId++;

    res.status(201).json(turno);
});

app.get("/turnos", (req, res) => {
    res.json(turnos);
});

app.get("/turnos/siguiente", (req, res) => {
    const siguiente = turnos.find(t => t.estado === "esperando");

    if (!siguiente) {
        return res.json({
            mensaje: "No hay turnos esperando"
        });
    }

    res.json(siguiente);
});

app.put("/turnos/llamar", (req, res) => {
    const atendiendo = turnos.find(t => t.estado === "atendiendo");

    if (atendiendo) {
        return res.status(400).json({
            mensaje: "Ya hay un turno siendo atendido"
        });
    }

    const siguiente = turnos.find(t => t.estado === "esperando");

    if (!siguiente) {
        return res.status(404).json({
            mensaje: "No hay turnos esperando"
        });
    }

    siguiente.estado = "atendiendo";

    res.json(siguiente);
});

app.put("/turnos/:id/finalizar", (req, res) => {
    const id = Number(req.params.id);
    const turno = turnos.find(t => t.id === id);

    if (!turno) {
        return res.status(404).json({
            mensaje: "Turno no encontrado"
        });
    }

    if (turno.estado !== "atendiendo") {
        return res.status(400).json({
            mensaje: "El turno no está siendo atendido"
        });
    }

    turno.estado = "finalizado";

    res.json(turno);
});

app.get("/turnos/espera", (req, res) => {
    const cantidad = turnos.filter(t => t.estado === "esperando").length;

    res.json({
        esperando: cantidad
    });
});

app.listen(3003, () => {
    console.log("API Turnos funcionando");
});