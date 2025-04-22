const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.getHome = (req, res, next) => {
  res.render("home", { title: "Home" });
};

exports.getSignUp = (req, res, next) => {
  res.render("singup", { title: "Sign Up" });
};

exports.postSignUp = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
};
