import Product from "../models/Product.js";

export const AddProduct = async (req, res, next) => {
    try {
        const productData = req.body;
        const { barcode } = req.body;

        const existingBarcode = await Product.find({ barcode: barcode});
        if(existingBarcode.length > 0) {
            return res.status(400).json({ success: false, message: "Bu ürün zaten kayıtlı"})
        }
        const createProduct = await Product.create(productData);

        return res.status(201).json({ success: true, data: createProduct})
    } catch (error) {
        next(error);
    }
}