import Sale from "../models/Sale.js";

export const AddSale = async (req, res, next) => {
    try {
        const saleData = req.body;
        const createSale = await Sale.create(saleData);

        return res.status(201).json({ success: true, data: createSale})
    } catch (error) {
        next(error);
    }
}