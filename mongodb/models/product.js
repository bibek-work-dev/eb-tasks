const mongoose = require("mongoose");
const variantSchema = require("./variant");
const { categorySchema } = require("./category");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    rating: {
      type: Number,
    },
    categories: [
      {
        category: {
          type: mongoose.Types.ObjectId,
          ref: "Category",
          categoryName: { type: String, required: true },
        },
        categoryName: { type: String, required: true },
      },
    ],
    totalReviews: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    recentReviews: {
      type: reviewSchema,
      default: [],
    },
    variant: {
      type: [variantSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
