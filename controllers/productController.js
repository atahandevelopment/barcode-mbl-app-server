import Product from "../models/Product.js";

// CREATE A NEW PRODUCT
export const AddProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    const { barcode } = req.body;

    const existingBarcode = await Product.find({ barcode: barcode });
    if (existingBarcode.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Bu ürün zaten kayıtlı" });
    }
    const createProduct = await Product.create(productData);

    return res.status(201).json({ success: true, data: createProduct });
  } catch (error) {
    next(error);
  }
};

// GET PRODUCTS
export const getProducts = async (req, res, next) => {
  try {
    const { id, name, barcode, price, barcode_type, product_type } = req.query;
    const queryArray = [];

    if (id) queryArray.push({ _id: id });
    if (name) queryArray.push({ name: name });
    if (barcode) queryArray.push({ barcode: barcode });
    if (price) queryArray.push({ price: price });
    if (barcode_type) queryArray.push({ barcode_type: barcode_type });
    if (product_type) queryArray.push({ product_type: product_type });

    let query = null;

    if (queryArray.length > 0) {
      query = { $or: queryArray };
    }

    const findProducts = await Product.find(query);

    if (findProducts) {
      res.status(200).json({ success: true, data: findProducts });
    } else {
      res.status(200).json({ success: true, data: [] });
    }
  } catch (error) {
    next(error);
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    const findProduct = await Product.findById({ _id: id });

    if (!findProduct)
      return res.status(404).json({ message: "Product not found" });

    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id },
      newData
    );

    if (updatedProduct) {
      res.status(200).json({
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } else {
      res.status(500).json({ message: "An error has occurred" });
    }
  } catch (error) {
    next(error);
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const findProduct = await Product.findById({ _id: id });

    if (!findProduct)
      return res.status(404).json({ message: "Product not found" });

    const deletedProduct = await Product.findByIdAndDelete({ _id: id });

    if (deletedProduct) {
      res.status(200).json({
        message: "Product deleted successfully",
        data: deletedProduct,
      });
    } else {
      res.status(500).json({ message: "An error has occurred" });
    }
  } catch (error) {
    next(error);
  }
};
