const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.status(200).render("product/add-product", {
    title: "Add Product",
    errorMessage: "",
    oldInput: { name: "", image: "", price: "" },
    product: {},
  });
};

exports.postAddProduct = async (req, res, next) => {
  const { name, image, price } = req.body;

  const product = new Product({
    name,
    image,
    price,
  });

  await product.save();
  res.redirect("/products");
};

exports.getProducts = async (req, res, next) => {
  const products = await Product.find();
  res.render("product/products", {
    title: "Products",
    products,
  });
};

exports.getEditProduct = async (req, res, next) => {
  const prodId = req.params.prodId;

  const product = await Product.findById(prodId);

  res.render("product/add-product", {
    title: "Edit Product",
    errorMessage: "",
    oldInput: { name: "", image: "", price: "" },
    product,
  });
};

exports.postEditProduct = async (req, res, next) => {
  const { name, image, price, prodId } = req.body;

  const product = await Product.findById(prodId);

  product.name = name;
  product.image = image;
  product.price = price;

  await product.save();

  res.redirect("/products");
};

exports.postDeleteProduct = async (req, res, next) => {
  const { prodId } = req.body;

  await Product.findByIdAndDelete(prodId);

  res.redirect("/products");
};
