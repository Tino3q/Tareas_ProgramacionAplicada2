import "dotenv/config";
import express from "express";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import inventarioRoutes from "./routes/inventario.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(loggerMiddleware);

app.use("/inventario", inventarioRoutes);

app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`);
});