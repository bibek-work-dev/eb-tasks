const mongoose = require("mongoose");
const variantSchema = require("./variant");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    rating: {
      type: Number,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    categoryName: {
      type: String,
    },
    // yo chai computed and subset prooperty
    reviewDetails: {
      recentReviews: {
        type: reviewSchema,
        default: [],
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
      averageRating: {
        type: Number,
        default: 0,
      },
    },
    discount: {
      type: Number,
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
