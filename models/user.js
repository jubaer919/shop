const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (productId) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === productId.toString();
  });

  let newquantity = 1;
  const updatedCart = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newquantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCart[cartProductIndex].quantity = newquantity;
  } else {
    updatedCart.push({
      productId: productId,
      quantity: 1,
    });
  }

  this.cart = { items: updatedCart };

  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedItems = this.cart.items.filter((product) => {
    return product.productId.toString() !== productId.toString();
  });
  this.cart = { items: updatedItems };

  return this.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
