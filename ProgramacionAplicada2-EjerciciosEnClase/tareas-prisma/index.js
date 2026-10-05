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



// 1. findMany con filtro, orden y paginación
const usuarios = await prisma.usuario.findMany({
  where: { activo: true },
  orderBy: { fechaRegistro: 'desc' },
  skip: 0,
  take: 5
});

// 2. findUnique y findFirst
const porId = await prisma.usuario.findUnique({ where: { id: 1 } });
const primerAdmin = await prisma.usuario.findFirst({ where: { rol: 'ADMIN' } });

// 3. create simple y con relación anidada
const nuevo = await prisma.usuario.create({
  data: {
    nombre: 'Carlos',
    email: 'carlos@example.com',
    posts: { create: [{ titulo: 'Primer post' }] }
  }
});

// 4. createMany
await prisma.usuario.createMany({
  data: [
    { nombre: 'Ana', email: 'ana@example.com' },
    { nombre: 'Luis', email: 'luis@example.com' }
  ]
});

// 5. update y updateMany
await prisma.usuario.update({
  where: { id: 1 },
  data: { nombre: 'Carlos G' }
});
await prisma.post.updateMany({
  where: { publicado: false },
  data: { publicado: true }
});

// 6. upsert
await prisma.perfil.upsert({
  where: { usuarioId: 1 },
  update: { bio: 'Bio editada' },
  create: { usuarioId: 1, bio: 'Bio nueva' }
});

// 7. delete y deleteMany
await prisma.usuario.delete({ where: { id: 2 } });
await prisma.post.deleteMany({ where: { vistas: 0 } });

// 8. count
const totalActivos = await prisma.usuario.count({ where: { activo: true } });

// 9. aggregate
const metricas = await prisma.post.aggregate({
  _avg: { vistas: true },
  _sum: { vistas: true }
});

// 10. groupBy
const porAutor = await prisma.post.groupBy({
  by: ['autorId'],
  _count: { _all: true }
});

// 11. Filtros avanzados
const busqueda = await prisma.post.findMany({
  where: {
    titulo: { contains: 'Node', startsWith: 'Guia' },
    estado: { in: ['PUBLICADO', 'REVISANDO'] },
    vistas: { gte: 10, lte: 500 }
  }
});

// 12. Relaciones con include y select
const conPosts = await prisma.usuario.findMany({ include: { posts: true } });
const soloNombres = await prisma.usuario.findMany({ select: { nombre: true, email: true } });

// 13. Transacciones
const [usuarioCreado, conteo] = await prisma.$transaction([
  prisma.usuario.create({ data: { nombre: 'Elena', email: 'elena@example.com' } }),
  prisma.usuario.count()
]);