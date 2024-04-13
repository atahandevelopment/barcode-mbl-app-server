import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import Months from "../mock/Months.js";

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

    const matchQuery = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (customer) {
      matchQuery["customer._id"] = customer;
    }

    // İKİ TARİH ARALIĞI TOPLAM TUTAR SORGULARI
    const salesReport = await Sale.aggregate([
      {
        $match: matchQuery,
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

    const totalSalesPrice = await Sale.aggregate([
      {
        $match: matchQuery,
      },
      {
        $group: {
          _id: null,
          total_price: { $sum: { $toDouble: "$total_price" } },
        },
      },
    ]);

    const totalPrice =
      totalSalesPrice.length > 0 ? totalSalesPrice[0].total_price : 0;

    return res
      .status(200)
      .json({ success: true, data: salesReport, total: totalPrice });
  } catch (error) {
    next(error);
  }
};

// 1 AY İÇİNDEKİ GÜNLÜK CHART VERİLERİ

export const chartController = async (req, res, next) => {
  try {
    const { month, year } = req.params;
    const fixedMonth = month - 1;

    const startDate = new Date(year, fixedMonth, 1);
    const endDate = new Date(year, fixedMonth + 1, 0);
    const endOfArray = endDate.getDate() + 1;

    const allDaysOfMonth = [];
    for (let day = 2; day <= endOfArray; day++) {
      allDaysOfMonth.push(new Date(year, fixedMonth, day));
    }

    const chartResponse = await Sale.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total_amount: { $sum: { $toDouble: "$total_price" } },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const chartData = allDaysOfMonth.map((day) => {
      const formattedDate = day.toISOString().split("T")[0];
      const saleData = chartResponse.find((item) => item._id === formattedDate);
      return {
        date: formattedDate,
        total_amount: saleData ? saleData.total_amount : 0,
      };
    });

    return res.status(200).json({ success: true, data: chartData });
  } catch (error) {
    next(error);
  }
};

export const yearlyCharts = async (req, res, next) => {
  try {
    const { year } = req.params;

    const chartData = await Sale.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lt: new Date(`${year}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalSales: { $sum: { $toDouble: "$total_price" } },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const formattedSales = Months.map((month) => {
      const saleData = chartData.find((sale) => sale._id.month === month.id);
      return {
        id: month.id,
        name: month.name,
        year,
        total_sales: saleData ? saleData.totalSales : 0,
      };
    });

    return res.status(200).json({ success: true, data: formattedSales });
  } catch (error) {
    next(error);
  }
};

export const weeklyChart = async (req, res, next) => {
  try {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 7);

    const dayOfWeek = [];

    for (let day = 1; day <= 7; day++) {
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + day);
      dayOfWeek.push(new Date(newDate));
      console.log(dayOfWeek);
    }

    const chartData = await Sale.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: { $toDouble: "$total_price" } },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const formattedSales = dayOfWeek.map((day) => {
      const formattedDate = day.toISOString().split("T")[0];
      const saleData = chartData.find((item) => item._id === formattedDate);
      return {
        date: formattedDate,
        amount: saleData ? saleData.amount : 0,
      };
    });

    return res.status(200).json({ success: true, data: formattedSales });
  } catch (error) {
    next(error);
  }
};
