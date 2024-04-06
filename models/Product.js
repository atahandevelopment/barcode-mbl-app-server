import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  barcode: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  barcode_type: {
    type: String,
    enum: ["terazi", "urun"],
    default: null
  },
  product_type: {
    type: String,
    enum: ["tartili", "parcali"],
    default: null
  },
}, {timestamps: true});

export default mongoose.model("Product", ProductSchema);
