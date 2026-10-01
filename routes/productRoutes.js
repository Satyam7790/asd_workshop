const express = require("express");
const cacheMiddleware = require("../middleware/cacheMiddleware");
const productController = require("../controllers/productController");

const router = express.Router();

router.get("/products", cacheMiddleware, productController.getProducts);
router.get("/products/:id", cacheMiddleware, productController.getProductById);

router.post("/products", productController.createProduct);
router.put("/products/:id", productController.updateProduct);
router.patch("/products/:id", productController.patchProduct);
router.delete("/products/:id", productController.deleteProduct);

module.exports = router;
