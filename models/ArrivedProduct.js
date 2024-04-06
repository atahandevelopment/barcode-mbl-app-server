import mongoose from "mongoose";

const ArrivedSchema = mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: {
        type: Number,
        required: true,
    }
}, {timestamps: true});

export default mongoose.model("ArrivedProduct", ArrivedSchema);
