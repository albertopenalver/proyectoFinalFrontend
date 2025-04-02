const express = require("express");
const router = express.Router();
const proveedorController = require("../controller/proveedor.controler");

router.post("/", proveedorController.crearProveedor);
router.get("/", proveedorController.getProveedores);
router.get("/:id", proveedorController.getProveeodrById);
router.delete("/:id", proveedorController.softDeleteProveedor);
router.delete("/", proveedorController.deleteAllProveedor);
router.put("/:id", proveedorController.updateProveedor);

module.exports = router;