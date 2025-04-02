
const express = require("express");
const router = express.Router();
const productController = require("../controller/product.controller");
const multer = require ("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const upload = multer({ storage });

router.post("/", productController.createProduct);
router.get('/', productController.getProducts);
router.delete('/:id', productController.softDeleteProduct);
router.delete('/',productController.deleteAllProducts)
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.get('/category/:categoryName', productController.getProductsByCategoryName);
router.get('/proveedor/:proveedorName', productController.getProductsByProveedorName);
router.get("/name/:productName", productController.getProductsByName);
router.put('/:id/photo', upload.single('photo'), productController.updateProductPhoto);


module.exports = router;