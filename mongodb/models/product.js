const mongoose = require("mongoose");

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
    price: {
      type: Number,
    },
    // yo chai computed property
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
        // computed property
        type: Number,
        default: 0,
      },
    },
    discount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
