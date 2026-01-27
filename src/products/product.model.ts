import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  company: { type: String, required: true },
  category: { type: String, required: true },
  actualPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  isUsedProduct: { type: Boolean, required: false, default: false }, 
    description: { type: String, required: false },
  attributes: {
    type: Object,
    default: {},
    required: false,
  }
}, {
  timestamps: true,
});

export default mongoose.model("Product", productSchema);
