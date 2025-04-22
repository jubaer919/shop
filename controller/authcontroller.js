const User = require("../models/user");
const bcrypt = require("bcrypt");
const { Resend } = require("resend");

const resend = new Resend("re_7zbfpTCB_BCH5zHGbusN7a7TMCAkYTNTg");

exports.getHome = (req, res, next) => {
  res.render("home", { title: "Home" });
};

exports.getSignUp = (req, res, next) => {
  res.render("signup", {
    title: "Sign Up",
    oldInput: { email: "", password: "", confirmPassword: "" },
  });
};

exports.postSignUp = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    res.status(401).render("signup", {
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

  res.status(200).redirect("/login");

  resend.emails.send({
    from: "Jubaer <onboarding@resend.dev>",
    to: email,
    subject: "Hello World",
    html: "<strong>It works!</strong>",
  });
};

exports.getLogIn = (req, res, next) => {
  res.render("login", {
    title: "Log In",
    oldInput: { email: "", password: "" },
  });
};

exports.postLogIn = async (req, res, next) => {
  const { email, password } = req.body;

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
    req.session.user = user;
    req.session.isLoggedIn = true;

    return res.status(200).render("home", {
      title: "Home",
    });
  } else {
    return res.status(400).render("login", {
      title: "Log In",
      oldInput: { email, password },
      errorMessage: "Wrong Password",
    });
  }
};
