const express = require("express");
const router = express.Router();
const mensajeController = require("../controller/mensaje.controller");

router.get("/", mensajeController.getMensajes);
router.post("/",mensajeController.createMensaje)

module.exports = router;