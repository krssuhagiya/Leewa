const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/Leewa");
const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  categoryGender: {
    type: String,
    enum: ["Men", "Women"],
    required: true
  }
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
