import Customer from "../models/Customer.js";

export const AddCustomer = async (req, res, next) => {
    console.log(req)
  try {
    const customerData = req.body;

    const createCustomer = await Customer.create(customerData);

    res.status(201).json({ success: true, data: createCustomer });
  } catch (error) {
    next(error);
  }
};


export const getCustomers = async (req, res, next) => {
    res.send({ success: true, message: "İstek doğru"})
};
