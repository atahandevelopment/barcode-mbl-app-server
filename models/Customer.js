import mongoose from "mongoose";

const CustomerSchema = mongoose.Schema({
  customer_name: {
    type: String,
    required: true,
  },
}, {timestamps: true});

export default mongoose.model("Customer", CustomerSchema);
