const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category.controller");

router.post("/", categoryController.crearCategoria);
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.get("/padre/sinpadre",categoryController.obtenerCategoriasSinPadre)
router.delete("/:id", categoryController.softDeleteCategory);
router.delete("/", categoryController.deleteAllCategory);
router.put("/:id", categoryController.updateCategory);
router.get('/padre/:categoriaPadreId', categoryController.getCategoriesByParent);




module.exports = router;

