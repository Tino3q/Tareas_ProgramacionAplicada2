import { Router } from "express";
import {
    crearTurno,
    obtenerTurnos,
    siguiente,
    llamar,
    finalizar,
    enEspera
} from "../controllers/turnos.controller.js";
import { validarTurno } from "../middlewares/validaciones.middleware.js";

const router = Router();

router.post("/", validarTurno, crearTurno);
router.get("/", obtenerTurnos);
router.get("/siguiente", siguiente);
router.put("/llamar", llamar);
router.put("/:id/finalizar", finalizar);
router.get("/espera", enEspera);

export default router;