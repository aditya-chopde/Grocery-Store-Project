const express = require("express");
const router = express.Router();
const product = require("../controllers/product");

router.get("/:shopname", product.getShopProducts);
router.get("/single/:id", product.getSingleProduct);
router.get("/", product.getAllProducts);
router.post("/add", product.addProduct);
router.put("/update/:id", product.updateProduct);
router.delete("/delete/:id", product.deleteProduct);
router.get("/nearest-shop-products", product.getNearestStoreProducts);

module.exports = router;
