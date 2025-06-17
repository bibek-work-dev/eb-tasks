const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    rating: {
      type: Number,
    },
    price: {
      type: Number,
    },
    price: {
      type: Number,
    },
    discount: {
      type: Number,
    },
  },
  {}
);

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
