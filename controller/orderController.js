const Order = require("../models/order");

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id });

    res.render("cart/order", {
      orders: orders,
      pageTitle: "Your Orders",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const Product = require("../models/product");

exports.postOrders = async (req, res, next) => {
  try {
    await req.user.populate("cart.items.productId");

    const products = req.user.cart.items.map((item) => {
      return {
        product: { ...item.productId._doc },
        quantity: item.quantity,
      };
    });

    const order = new Order({
      products: products,
      user: {
        email: req.user.email,
        userId: req.user._id,
      },
    });

    await order.save();

    // Clear user's cart after successful order
    req.user.cart.items = [];
    await req.user.save();

    res.redirect("/order");
  } catch (err) {
    console.log(err);
    next(err);
  }
};
