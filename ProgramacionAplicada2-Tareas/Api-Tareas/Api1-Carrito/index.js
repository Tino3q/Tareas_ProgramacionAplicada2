const express = require("express");

const app = express();
app.use(express.json());

let productos = [];
let siguienteId = 1;

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

function validarProducto(req, res, next) {
    const { nombre, precio, cantidad } = req.body;

    if (!nombre || typeof precio !== "number" || precio <= 0 ||
        typeof cantidad !== "number" || cantidad <= 0) {
        return res.status(400).json({ mensaje: "Datos inválidos" });
    }

    next();
}

function validarCantidad(req, res, next) {
    const { cantidad } = req.body;

    if (typeof cantidad !== "number" || cantidad <= 0) {
        return res.status(400).json({ mensaje: "Cantidad inválida" });
    }

    next();
}

app.get("/productos", (req, res) => {
    res.json(productos);
});

app.post("/productos", validarProducto, (req, res) => {
    const { nombre, precio, cantidad } = req.body;

    const producto = productos.find(p => p.nombre === nombre);

    if (producto) {
        producto.cantidad += cantidad;
        return res.json(producto);
    }

    const nuevoProducto = {
        id: siguienteId,
        nombre,
        precio,
        cantidad
    };

    productos.push(nuevoProducto);
    siguienteId++;

    res.status(201).json(nuevoProducto);
});

app.put("/productos/:id", validarCantidad, (req, res) => {
    const id = Number(req.params.id);
    const producto = productos.find(p => p.id === id);

    if (!producto) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    producto.cantidad = req.body.cantidad;

    res.json(producto);
});

app.delete("/productos/:id", (req, res) => {
    const id = Number(req.params.id);
    const producto = productos.find(p => p.id === id);

    if (!producto) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    productos = productos.filter(p => p.id !== id);

    res.json({ mensaje: "Producto eliminado" });
});

app.get("/carrito/total", (req, res) => {
    let total = 0;

    productos.forEach(p => {
        total += p.precio * p.cantidad;
    });

    res.json({ total });
});

app.post("/carrito/aplicar-descuento", (req, res) => {
    const { porcentaje } = req.body;

    if (typeof porcentaje !== "number" || porcentaje < 0 || porcentaje > 50) {
        return res.status(400).json({ mensaje: "Descuento inválido" });
    }

    let total = 0;

    productos.forEach(p => {
        total += p.precio * p.cantidad;
    });

    const descuento = total * porcentaje / 100;
    const totalFinal = total - descuento;

    res.json({
        total,
        descuento,
        totalFinal
    });
});

app.listen(3000, () => {
    console.log("API Carrito funcionando");
});
