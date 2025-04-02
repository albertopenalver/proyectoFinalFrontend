
const express = require("express");
const router = express.Router();
const movimientosController = require("../controller/movimientos.controller");

router.post("/", movimientosController.registrarMovimientos);
router.put("/", movimientosController.actualizarInventario);
router.post("/send", movimientosController.enviarMailProveedor)
router.get("/", movimientosController.obtenerMovimientosGuardados);
router.put("/estado", movimientosController.cambiarEstadoMovimiento);



module.exports = router;
