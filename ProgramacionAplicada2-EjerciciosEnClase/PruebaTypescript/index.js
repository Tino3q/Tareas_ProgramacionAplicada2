const express = require('express');
const app = express();

app.use(express.json());

app.listen(3000, () => (console.log('Server is running on port 3000')));

app.get('/', (req, res) => {
    res.json({ message: "pong"});
});

//ruta por paramentro usuarios/42
app.get('/usuarios/:id', (req, res) => {
    res.json({ id: req.params.id });
});

//rutas por paramentro ejemplo buscar?nombre=Juan
app.get('/buscar', (req, res) => {
    res.json({ nombre: req.query.nombre });
});

//recibir datos en el body de la petición
app.post('/usuarios', (req, res) => {
    const { nombre, edad } = req.body;
    res.json({ recibido: { nombre, edad } });
});






app.get("/productos", (req, res) => {
    res.json([
        { nombre: "Mouse", precio: 500 }
    ]);
});



app.get("/productos", (req, res) => {
    res.json(productos);
});


app.post("/productos", (req, res) => {
    res.json({
        mensaje: "Producto creado"
    });
});

app.put("/productos/:id", (req, res) => {
    res.json({
        mensaje: "Producto actualizado"
    });
});

app.delete("/productos/:id", (req, res) => {
    res.json({
        mensaje: "Producto eliminado"
    });
});


res.status(404).json({
    mensaje: "Producto no encontrado"
});

app.get("/productos", (req, res) => {
    res.json(productos);
});


app.get("/saludo", (req, res) => {
    res.json({ mensaje: "Hola" });
});


app.post("/productos", (req, res) => {
    const producto = req.body;

    res.status(201).json(producto);
});

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});
