const express = require("express");

const productController = require("../controller/productController");

const router = express.Router();

router.get("/add-product", productController.getAddProduct);

router.post("/add-product", productController.postAddProduct);

router.get("/products", productController.getProducts);

router.get("/edit-product/:prodId", productController.getEditProduct);

router.post("/edit-product", productController.postEditProduct);

router.post("/delete-product", productController.postDeleteProduct);

module.exports = router;
