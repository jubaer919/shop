const express = require("express");

const authController = require("../controller/authcontroller");

const router = express.Router();

router.get("/", authController.getHome);

module.exports = router;
