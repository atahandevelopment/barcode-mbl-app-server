import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";

export const AddSale = async (req, res, next) => {
  try {
    const { barcode, quantity, customer } = req.body;

    const findProduct = await Product.find({ barcode: barcode });
    const findCustomer = await Customer.find({ _id: customer });

    if (!findProduct || !findCustomer)
      return res.status(404).send({ message: "Product or Customer not found" });

    const createSale = await Sale.create({
      quantity,
      total_price: findProduct[0]?.price * quantity,
      product: {
        _id: findProduct[0]._id,
        name: findProduct[0].name,
        barcode: findProduct[0].barcode,
        price: findProduct[0].price,
        product_type: findProduct[0].product_type,
        barcode_type: findProduct[0].barcode_type,
        ...(barcode.slice(0, 2) === "29" ? { birim: "kg" } : { birim: "adet" }),
      },
      customer: {
        _id: findCustomer[0]._id,
        customer_name: findCustomer[0].customer_name,
      },
    });

    if (createSale)
      return res.status(201).json({ success: true, data: createSale });

    return res.status(500).json({ message: "An error has occurred" });
  } catch (error) {
    next(error);
  }
};

export const getSales = async (req, res, next) => {
  try {
    const {
      id,
      name,
      barcode,
      product_name,
      product_price,
      customer_name,
      total_price,
      quantity,
      start_date,
      end_date,
    } = req.query;
    const queryArray = [];
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (id) queryArray.push({ _id: id });
    if (name) queryArray.push({ name: name });
    if (barcode) queryArray.push({ "product.barcode": barcode });
    if (customer_name)
      queryArray.push({ "customer.customer_name": customer_name });
    if (product_name) queryArray.push({ "product.name": product_name });
    if (product_price) queryArray.push({ "product.price": product_price });
    if (total_price) queryArray.push({ total_price: total_price });
    if (quantity) queryArray.push({ quantity: parseInt(quantity) });
    if (end_date && start_date)
      queryArray.push({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      });

    let query = null;

    if (queryArray.length > 0) {
      query = { $or: queryArray };
    }

    const findSales = await Sale.find(query);

    if (findSales.length > 0) {
      res.status(200).json({ success: true, data: findSales });
    } else {
      res.status(200).json({ success: false, data: [] });
    }
  } catch (error) {
    next(error);
  }
};

export const updateSale = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    const findSale = await Sale.find({ _id: id });

    if (!findSale) return res.status(404).json({ message: "Sale not found" });

    const updatedData = await Sale.findByIdAndUpdate({ _id: id }, newData, {
      new: true,
    });

    return res
      .status(200)
      .json({ message: "Updated successfully", data: updatedData });
  } catch (error) {
    next(error);
  }
};

export const deleteSale = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedSale = await Sale.findByIdAndDelete({ _id: id });

    if (deletedSale) {
      return res
        .status(200)
        .json({ message: "Sales deleted successfully", data: deletedSale });
    } else {
      return res.status(404).json({ message: "Sales not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const getSalesReports = async (req, res, next) => {
  try {
    const { start_date, end_date, customer } = req.query;

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    const salesReport = await Sale.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
          "customer._id": customer,
        },
      },
      {
        $group: {
          _id: "$product.barcode",
          name: {
            $first: "$product.name",
          },
          barcode: {
            $first: "$product.barcode",
          },
          birim: {
            $first: "$product.birim",
          },
          sales: {
            $push: {
              quantity: "$quantity",
              total_price: "$total_price",
            },
          },
        },
      },
      {
        $addFields: {
          total_sales: {
            $reduce: {
              input: "$sales",
              initialValue: 0,
              in: {
                $sum: ["$$value", { $toDouble: "$$this.total_price" }],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          barcode: 1,
          birim: 1,
          total_quantity: { $sum: "$sales.quantity" },
          total_price: "$total_sales",
        },
      },
    ]);

    return res.status(200).json({ success: true, data: salesReport });
  } catch (error) {
    next(error);
  }
};
