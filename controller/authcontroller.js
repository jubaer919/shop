const User = require("../models/user");
const bcrypt = require("bcrypt");
const { Resend } = require("resend");
const { validationResult } = require("express-validator");
const crypto = require("crypto");

const resend = new Resend("re_7zbfpTCB_BCH5zHGbusN7a7TMCAkYTNTg");

exports.getHome = (req, res, next) => {
  res.render("home", { title: "Home" });
};

exports.getSignUp = (req, res, next) => {
  res.render("signup", {
    title: "Sign Up",
    errorMessage: "",
    oldInput: { email: "", password: "", confirmPassword: "" },
  });
};

exports.postSignUp = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("signup", {
      title: "Sign Up",
      oldInput: { email, password, confirmPassword },
      errorMessage: errors.array()[0].msg,
    });
  }

  const user = await User.findOne({ email });

  if (user) {
    return res.status(401).render("signup", {
      title: "Sing Up",
      oldInput: { email, password, confirmPassword },
      errorMessage: "email is already taken",
    });
  }

  const encPassword = await bcrypt.hash(password, 12);

  const newuser = new User({
    email,
    password: encPassword,
  });

  await newuser.save();

  await resend.emails.send({
    from: "Jubaer <onboarding@resend.dev>",
    to: email,
    subject: "helo from resend",
    html: "<strong>it is working</strong>",
  });

  res.status(200).redirect("/login");
};

exports.getLogIn = (req, res, next) => {
  res.render("login", {
    title: "Log In",
    errorMessage: "",
    oldInput: { email: "", password: "" },
  });
};

exports.postLogIn = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("login", {
      title: "Log In",
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).render("login", {
      title: "Log In",
      oldInput: { email, password },
      errorMessage: "No account in this eamil",
    });
  }

  const doMatch = await bcrypt.compare(password, user.password);

  if (doMatch) {
    req.session.userId = user._id;
    req.session.isLoggedIn = true;

    req.session.save((err) => {
      if (err) {
        res.redirect("/login");
      }
      res.redirect("/");
    });
  } else {
    return res.status(400).render("login", {
      title: "Log In",
      oldInput: { email, password },
      errorMessage: "Wrong Password",
    });
  }
};

exports.postLogOut = async (req, res, next) => {
  req.session.isLoggedIn = false;
  return res.redirect("/");
};

exports.getForgotPassword = (req, res, next) => {
  res.status(200).render("reset", {
    title: "Forgot Password",
    oldInput: "",
    errorMessage: "",
  });
};

exports.postForgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(422).render("reset", {
      title: "Forgot Password",
      oldInput: { email },
      errorMessage: "can't find the email",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpiration = Date.now() + 3600000;
  await user.save();
  res.redirect("/");
  resend.emails.send({
    from: "Jubaer <onboarding@resend.dev>",
    to: req.body.email,
    subject: "Password reset",
    html: `
          <p>You requested a Password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new Password</p>
        `,
  });
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).render("reset", {
      title: "Reset Password",
      errorMessage: "Password reset link is invalid or has expired.",
      oldInput: "",
    });
  }

  res.status(200).render("new-password", {
    title: "New Password",
    errorMessage: "",
    oldInput: { password: "", confirmPassword: "" },
    userId: user._id.toString(),
    token: token,
  });
};

exports.postNewPassword = async (req, res, next) => {
  const { password, confirmPassword, token, userId } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("new-password", {
      title: "New Password",
      errorMessage: errors.array()[0].msg,
      oldInput: { password, confirmPassword },
      token,
      userId,
    });
  }

  const user = await User.findOne({
    _id: userId,
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).render("reset", {
      title: "Reset Password",
      errorMessage: "Invalid or expired token",
      oldInput: "",
    });
  }

  const encPassword = await bcrypt.hash(password, 12);
  user.password = encPassword;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  await user.save();

  res.redirect("/login");
};
