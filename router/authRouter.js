const express = require("express");

const { body } = require("express-validator");

const authController = require("../controller/authcontroller");

const router = express.Router();

router.get("/", authController.getHome);

router.get("/signup", authController.getSignUp);

router.post(
  "/signup",
  [
    body("email").trim().isEmail().withMessage("Please Enter a valid Email"),

    body(
      "password",
      "Password should contain min 6 letters, a capital letter, small letter, number and a special character"
    )
      .trim()
      .notEmpty()
      .isLength({ min: 6 })
      .matches(/[A-Z]/)
      .matches(/[a-z]/)
      .matches(/[0-9]/)
      .matches(/[\W_]/),

    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password Don't Match");
      }
      return true;
    }),
  ],
  authController.postSignUp
);

router.get("/login", authController.getLogIn);

router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Please Enter a valid Email"),

    body("password").trim().notEmpty().withMessage("password is required"),
  ],
  authController.postLogIn
);

router.post("/logout", authController.postLogOut);

router.get("/reset", authController.getForgotPassword);

router.post("/reset", authController.postForgotPassword);

router.get("/reset/:token", authController.getNewPassword);

router.post(
  "/new-password",
  [
    body(
      "password",
      "Password should contain min 6 letters, a capital letter, small letter, number and a special character"
    )
      .trim()
      .notEmpty()
      .isLength({ min: 6 })
      .matches(/[A-Z]/)
      .matches(/[a-z]/)
      .matches(/[0-9]/)
      .matches(/[\W_]/),

    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password Don't Match");
      }
      return true;
    }),
  ],
  authController.postNewPassword
);

module.exports = router;
