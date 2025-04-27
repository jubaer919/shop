const express = require("express");

const cartController = require("../controller/cartController");
const orderController = require("../controller/orderController");

const router = express.Router();

router.get("/cart", cartController.getCart);

router.post("/cart", cartController.postCart);

router.post("/cart-delete-item", cartController.postRemoveFromCart);

router.get("/order", orderController.getOrders);

router.post("/order", orderController.postOrders);

module.exports = router;
