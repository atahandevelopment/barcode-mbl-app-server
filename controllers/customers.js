import Customer from "../models/Customer.js";

export const AddCustomer = async (req, res, next) => {
  try {
    const customerData = req.body;

    const createCustomer = await Customer.create(customerData);

    res.status(201).json({ success: true, data: createCustomer });
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    const { id, name } = req.query;
    const queryArray = [];
    if (id) {
      queryArray.push({ _id: id });
    }
    if (name) {
      queryArray.push({ customer_name: name });
    }
    let query = null;
    if (queryArray.length > 0) {
      query = { $or: queryArray };
    }
    const findCustomer = await Customer.find(query);

    res.status(200).json({ success: true, data: findCustomer });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    const findCustomer = await Customer.findById({ _id: id });

    if (!findCustomer) {
      res.status(400).json({ message: "Customer not found" });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      { _id: id },
      newData
    );

    if (updatedCustomer) {
      res.status(200).json({
        message: "Customer updated successfully",
        data: updatedCustomer,
      });
    } else {
      res.status(500).json({ message: "An error occurred while updating" });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const findCustomer = await Customer.findById({_id: id});

    if (!findCustomer)
      return res.status(404).json({ message: "Customer not found" });

    const deleteCustomer = await Customer.findByIdAndDelete({ _id: id });
    if(deleteCustomer) {
      res.status(200).json({
        message: "Customer deleted successfully",
        data: deleteCustomer,
      });
    } else {
      res.status(500).json({ message: "An error occurred while deleting" });
    }
  } catch (error) {
    next(error);
  }
};
