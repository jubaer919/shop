const mongoose = require("mongoose");

let _db;

const mongooseConnect = async () => {
  const con = await mongoose.connect(
    "mongodb+srv://jubaerdiu:bLUyFmpQpCfbJfQ4@cluster0.kfnx6.mongodb.net/test"
  );

  return (_db = con.connection);
};

const getDB = async () => {
  if (_db) {
    return _db;
  }

  return await mongooseConnect();
};

module.exports = getDB;
