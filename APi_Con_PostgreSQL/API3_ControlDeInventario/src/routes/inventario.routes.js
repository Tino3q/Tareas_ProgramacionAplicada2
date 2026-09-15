import { Router } from "express";
import {
    listarInventario,
    crearProducto,
    entrada,
    salida,
    alertas
} from "../controllers/inventario.controller.js";
import { validarProducto, validarCantidad } from "../middlewares/validaciones.middleware.js";

const router = Router();

router.get("/", listarInventario);
router.post("/", validarProducto, crearProducto);
router.post("/:id/entrada", validarCantidad, entrada);
router.post("/:id/salida", validarCantidad, salida);
router.get("/alertas", alertas);

export default router;