import mongoose from "mongoose";

const SaleSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  barcode: {
    type: String,
    required: true,
  },
  total_price: {
    type: String,
    required: true,
  },
}, {timestamps: true});

export default mongoose.model("Sale", SaleSchema);
