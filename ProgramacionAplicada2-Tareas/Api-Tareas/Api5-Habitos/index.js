const express = require("express");

const app = express();
app.use(express.json());

let habitos = [];
let siguienteId = 1;

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

function validarHabito(req, res, next) {
    const { nombre, meta } = req.body;

    if (!nombre || typeof meta !== "number" || meta <= 0) {
        return res.status(400).json({
            mensaje: "Datos inválidos"
        });
    }

    next();
}

function diferenciaDias(fecha1, fecha2) {
    const dia1 = new Date(fecha1);
    const dia2 = new Date(fecha2);

    return Math.round((dia2 - dia1) / (1000 * 60 * 60 * 24));
}

app.post("/habitos", validarHabito, (req, res) => {
    const habito = {
        id: siguienteId,
        nombre: req.body.nombre,
        meta: req.body.meta,
        registros: []
    };

    habitos.push(habito);
    siguienteId++;

    res.status(201).json(habito);
});

app.get("/habitos", (req, res) => {
    res.json(habitos);
});

app.post("/habitos/:id/registrar", (req, res) => {
    const id = Number(req.params.id);
    const habito = habitos.find(h => h.id === id);

    if (!habito) {
        return res.status(404).json({
            mensaje: "Hábito no encontrado"
        });
    }

    const fecha = new Date().toISOString().split("T")[0];

    const existe = habito.registros.find(r => r.fecha === fecha);

    if (existe) {
        return res.status(400).json({
            mensaje: "El hábito ya fue registrado hoy"
        });
    }

    habito.registros.push({
        fecha,
        completado: true
    });

    res.json(habito);
});

app.get("/habitos/:id/estadisticas", (req, res) => {
    const id = Number(req.params.id);
    const habito = habitos.find(h => h.id === id);

    if (!habito) {
        return res.status(404).json({
            mensaje: "Hábito no encontrado"
        });
    }

    if (habito.registros.length === 0) {
        return res.json({
            rachaActual: 0,
            mejorRacha: 0,
            porcentajeCumplimiento: 0
        });
    }

    const registros = [...habito.registros].sort((a, b) =>
        a.fecha.localeCompare(b.fecha)
    );

    let mejorRacha = 1;
    let racha = 1;

    for (let i = 1; i < registros.length; i++) {
        const dias = diferenciaDias(registros[i - 1].fecha, registros[i].fecha);

        if (dias === 1) {
            racha++;
        } else {
            racha = 1;
        }

        if (racha > mejorRacha) {
            mejorRacha = racha;
        }
    }

    const hoy = new Date().toISOString().split("T")[0];
    let rachaActual = 0;

    if (registros[registros.length - 1].fecha === hoy) {
        rachaActual = 1;

        for (let i = registros.length - 1; i > 0; i--) {
            const dias = diferenciaDias(
                registros[i - 1].fecha,
                registros[i].fecha
            );

            if (dias === 1) {
                rachaActual++;
            } else {
                break;
            }
        }
    }

    const primeraFecha = registros[0].fecha;
    const diasTotales = diferenciaDias(primeraFecha, hoy) + 1;
    const porcentaje = (registros.length / diasTotales) * 100;

    res.json({
        rachaActual,
        mejorRacha,
        porcentajeCumplimiento: Number(porcentaje.toFixed(2))
    });
});

app.delete("/habitos/:id", (req, res) => {
    const id = Number(req.params.id);
    const habito = habitos.find(h => h.id === id);

    if (!habito) {
        return res.status(404).json({
            mensaje: "Hábito no encontrado"
        });
    }

    habitos = habitos.filter(h => h.id !== id);

    res.json({
        mensaje: "Hábito eliminado"
    });
});

app.listen(3004, () => {
    console.log("API Hábitos funcionando");
});