const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const getDB = require("./db/database");
const authRoutes = require("./router/authRouter");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://jubaerdiu:bLUyFmpQpCfbJfQ4@cluster0.kfnx6.mongodb.net/test",
    }),
  })
);

app.use(async (req, res, next) => {
  req.user = req.session.user;
  res.locals.isAuthenticated = req.session.isLoggedIn || false;
  next();
});

app.use(authRoutes);

const mongoConnect = async () => {
  await getDB();
  app.listen(3000, () => {
    console.log("App is running on port 3000");
  });
};

mongoConnect();
