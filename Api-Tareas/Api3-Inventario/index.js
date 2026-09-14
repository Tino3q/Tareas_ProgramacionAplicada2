const express = require("express");

const app = express();
app.use(express.json());

let inventario = [];
let siguienteId = 1;

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

function validarProducto(req, res, next) {
    const { producto, stock, stockMinimo } = req.body;

    if (!producto || typeof stock !== "number" || stock < 0) {
        return res.status(400).json({
            mensaje: "Datos inválidos"
        });
    }

    if (stockMinimo !== undefined &&
        (typeof stockMinimo !== "number" || stockMinimo < 0)) {
        return res.status(400).json({
            mensaje: "Stock mínimo inválido"
        });
    }

    next();
}

function validarCantidad(req, res, next) {
    const { cantidad } = req.body;

    if (typeof cantidad !== "number" || cantidad <= 0) {
        return res.status(400).json({
            mensaje: "Cantidad inválida"
        });
    }

    next();
}

app.get("/inventario", (req, res) => {
    res.json(inventario);
});

app.post("/inventario", validarProducto, (req, res) => {
    const nuevoProducto = {
        id: siguienteId,
        producto: req.body.producto,
        stock: req.body.stock,
        stockMinimo: req.body.stockMinimo ?? 5
    };

    inventario.push(nuevoProducto);
    siguienteId++;

    res.status(201).json(nuevoProducto);
});

app.post("/inventario/:id/entrada", validarCantidad, (req, res) => {
    const id = Number(req.params.id);
    const producto = inventario.find(p => p.id === id);

    if (!producto) {
        return res.status(404).json({
            mensaje: "Producto no encontrado"
        });
    }

    producto.stock += req.body.cantidad;

    res.json(producto);
});

app.post("/inventario/:id/salida", validarCantidad, (req, res) => {
    const id = Number(req.params.id);
    const producto = inventario.find(p => p.id === id);

    if (!producto) {
        return res.status(404).json({
            mensaje: "Producto no encontrado"
        });
    }

    if (req.body.cantidad > producto.stock) {
        return res.status(400).json({
            mensaje: "No hay suficiente stock"
        });
    }

    producto.stock -= req.body.cantidad;

    res.json(producto);
});

app.get("/inventario/alertas", (req, res) => {
    const alertas = inventario
        .filter(p => p.stock < p.stockMinimo)
        .map(p => ({
            producto: p.producto,
            stock: p.stock,
            stockMinimo: p.stockMinimo,
            falta: p.stockMinimo - p.stock
        }));

    res.json(alertas);
});

app.listen(3002, () => {
    console.log("API Inventario funcionando");
});