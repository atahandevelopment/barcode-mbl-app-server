import ArrivedProduct from "../models/ArrivedProduct.js";

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
    const { id, start_date, end_date } = req.query;
    const queryArray = [];

    if (id) queryArray.push({ _id: id });
    if (start_date) queryArray.push({ start_date: start_date });
    if (end_date) queryArray.push({ end_date: end_date });

    let query = null;

    if (queryArray.length > 0) {
      query = { $or: queryArray };
    }

    const findArrivedProducts = await ArrivedProduct.find(query).populate('product');

    if (findArrivedProducts.length > 0) {
      return res.status(200).json({ success: true, data: findArrivedProducts });
    } else {
      return res.status(200).json({ success: false, data: [] });
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

    const updatedData = await ArrivedProduct.findByIdAndDelete(
      { _id: id }
    );

    if (updatedData) {
      return res.status(200).json({ success: true, data: updatedData });
    }
  } catch (error) {
    next(error);
  }
};
