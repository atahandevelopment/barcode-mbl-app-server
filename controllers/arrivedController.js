import ArrivedProduct from "../models/ArrivedProduct.js";
import mongoose from "mongoose";

export const AddArrivedProduct = async (req, res, next) => {
  try {
    const arrivedData = req.body;
    const createArrived = await ArrivedProduct.create(arrivedData);

    return res.status(201).json({ success: true, data: createArrived });
  } catch (error) {
    next(error);
  }
};

export const getArrivedProducts = async (req, res, next) => {
  try {
    const { id, product, start_date, end_date } = req.query;
    let newQuery = {};
    const aggregatePipeline = [];

    if (id) {
      newQuery._id = id;
    }
    if (start_date && end_date) {
      newQuery.createdAt = {
        $gte: new Date(start_date),
        $lte: new Date(end_date),
      };
    }

    if (product) {
      newQuery.product = new mongoose.Types.ObjectId(product);
    }

    aggregatePipeline.push({ $match: newQuery });

    if (Object.keys(newQuery).length !== 0) {
      aggregatePipeline.push({
        $group: {
          _id: null, // Burada '_id' yerine 'product' kullanılmalı
          total_quantity: { $sum: "$quantity" },
        },
      });
    }
    
    const aggragateTotal = await ArrivedProduct.aggregate(aggregatePipeline);

    let totalQuantity = 0;
    if (product) {
      totalQuantity = aggragateTotal[0]?.total_quantity;
    }

    const findArrivedProducts = await ArrivedProduct.find(newQuery).populate(
      "product"
    );


    if (findArrivedProducts.length > 0) {
      return res.status(200).json({
        success: true,
        ...(product && { total_quantity: totalQuantity }),
        data: findArrivedProducts,
      });
    } else {
      return res
        .status(200)
        .json({ success: false, data: [], total_quantity: 0 });
    }
  } catch (error) {
    next(error);
  }
};

export const updateArrivedProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    const updatedData = await ArrivedProduct.findByIdAndUpdate(
      { _id: id },
      newData,
      { new: true }
    );

    if (updatedData) {
      return res.status(200).json({ success: true, data: updatedData });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteArrivedProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedData = await ArrivedProduct.findByIdAndDelete({ _id: id });

    if (updatedData) {
      return res.status(200).json({ success: true, data: updatedData });
    }
  } catch (error) {
    next(error);
  }
};
