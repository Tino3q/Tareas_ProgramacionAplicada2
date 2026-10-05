import { Router } from "express";
import {
    crearHabito,
    obtenerHabitos,
    registrarHabito,
    estadisticas,
    eliminarHabito
} from "../controllers/habitos.controller.js";
import { validarHabito } from "../middlewares/validaciones.middleware.js";

const router = Router();

router.post("/", validarHabito, crearHabito);
router.get("/", obtenerHabitos);
router.post("/:id/registrar", registrarHabito);
router.get("/:id/estadisticas", estadisticas);
router.delete("/:id", eliminarHabito);

export default router;