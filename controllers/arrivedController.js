import ArrivedProduct from "../models/ArrivedProduct.js";

export const AddArrivedProduct = async (req, res, next) => {
    try {
        const arrivedData = req.body;
        const createArrived = await ArrivedProduct.create(arrivedData);

        return res.status(201).json({ success: true, data: createArrived})
    } catch (error) {
        next(error);
    }
}