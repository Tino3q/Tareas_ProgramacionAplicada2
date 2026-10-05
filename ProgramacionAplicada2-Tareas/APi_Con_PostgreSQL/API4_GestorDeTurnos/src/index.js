import "dotenv/config";
import express from "express";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import turnosRoutes from "./routes/turnos.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(loggerMiddleware);

app.use("/turnos", turnosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`);
});