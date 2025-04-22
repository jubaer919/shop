const express = require("express");

const getDB = require("./db/database");
const authRoutes = require("./router/authRouter");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(authRoutes);

const mongoConnect = async () => {
  await getDB();
  app.listen(3000, () => {
    console.log("App is running on port 3000");
  });
};

mongoConnect();
