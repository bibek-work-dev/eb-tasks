exports.categorySchema = new mongoose.Schema(
  {
    category: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
