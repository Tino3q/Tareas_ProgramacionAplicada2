import "dotenv/config";
import express from "express";
import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "@prisma/client";
import pg from "pg";

const app = express();

//configuracion del driver adapter para PostgreSql
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

//instalacion del cliente con el adaptador

const prisma = new PrismaClient({adapter});

//middle para procesar json en las peticiones
app.use(express.json());


app.use((req, res, next) => {
    console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.url}`
    );
    next();
});

const validarTitulo = (req, res, next) => {
    if (!req.body.titulo) {
        return res.status(400).json({error: "El titulo es requerido"});
    }
    next();
};

//GET todas las tareas
app.get("/tareas", async (req, res) => {
    const tareas = await prisma.tarea.findMany();
    res.json(tareas);
});

//GET tarea individual por ID
app.get("/tareas/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const tarea = await prisma.tarea.findUnique({
        where: {id}
    });

    if (!tarea) {
        return res.status(404).json({error: "Tarea no encontrada"});
    }
    res.json(tarea);
});

//POST crear nueva tarea
app.post ("/tareas", validarTitulo, async (req, res) => {
    const {titulo} = req.body;
    const tarea = await prisma.tarea.create({
        data: {titulo}
    });
    res.status(201).json(tarea);
});

//PUT actualizar dinamica
app.put("/tareas/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const tareaExiste = await prisma.tarea.findUnique({
        where: {id}
    });

    if (!tareaExiste) {return res.status(404).json({error: "Tarea no encontrada"});}

    const {titulo, completada} = req.body;
    const tarea = await prisma.tarea.update({
        where: {id},
        data: {
            ...(titulo !== undefined && {titulo}),
            ...(completada !== undefined && {completada})
        }
    });
    res.json(tarea);
});

app.listen (3000, () => {
    console.log("Servidor escuchando en http://localhost:3000");
});