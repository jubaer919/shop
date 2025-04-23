const express = require("express");

const authController = require("../controller/authcontroller");

const router = express.Router();

router.get("/", authController.getHome);

router.get("/signup", authController.getSignUp);

router.post("/signup", authController.postSignUp);

router.get("/login", authController.getLogIn);

router.post("/login", authController.postLogIn);

router.post("/logout", authController.postLogOut);

module.exports = router;
