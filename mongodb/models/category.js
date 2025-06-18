const categorySchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
