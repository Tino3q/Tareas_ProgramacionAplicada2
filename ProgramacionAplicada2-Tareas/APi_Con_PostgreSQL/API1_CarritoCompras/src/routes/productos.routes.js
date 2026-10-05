import { Router } from "express";
import {
    obtenerProductos,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto
} from "../controllers/productos.controller.js";
import { validarProducto, validarCantidadUpdate } from "../middlewares/validaciones.middleware.js";

const router = Router();

router.get("/", obtenerProductos);
router.post("/", validarProducto, agregarProducto);
router.put("/:id", validarCantidadUpdate, actualizarCantidad);
router.delete("/:id", eliminarProducto);

export default router;