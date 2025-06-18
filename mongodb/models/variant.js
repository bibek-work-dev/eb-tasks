const variantSchema = new mongoose.Schema(
  {
    proudctId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantName: { type: String, required: true },
    price: { type: Number, required: true },
    discountInPercentage: { type: Number, required: false },
    discountedAmount: { type: Number },
  },
  {
    timestamps: true,
  }
);

const VariantModel = mongoose.model("Variant", variantSchema);

module.exports = VariantModel;
