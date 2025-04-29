const User = require("../models/user");

exports.getCart = async (req, res, next) => {
  await req.user.populate("cart.items.productId");

  const cartItems = req.user.cart.items;

  res.render("cart/cart", {
    title: "cart",
    cartItems,
  });
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.prodId;

  await req.user.addToCart(prodId);
  res.redirect("/cart");
};

exports.postRemoveFromCart = async (req, res, next) => {
  const prodId = req.body.prodId;

  await req.user.removeFromCart(prodId);

  res.redirect("/cart");
};
