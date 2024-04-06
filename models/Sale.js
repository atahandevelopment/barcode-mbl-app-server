import mongoose from "mongoose";

const ProductSchema = 
  {
    _id: {
      type: String,
    },
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
      default: null,
    },
    product_type: {
      type: String,
      enum: ["tartili", "parcali"],
      default: null,
    },
  };

const CustomerSchema = 
  {
    _id: {
      type: String,
    },
    customer_name: {
      type: String,
      required: true,
    },
  }

const SaleSchema = mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    product: ProductSchema,
    total_price: {
      type: String,
      required: true,
    },
    customer: CustomerSchema,
  },
  { timestamps: true }
);

export default mongoose.model("Sale", SaleSchema);
