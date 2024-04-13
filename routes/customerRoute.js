import express from "express";
import {
  AddCustomer,
  getCustomers,
  deleteCustomer,
  updateCustomer,
} from "../controllers/customers.js";

const router = express.Router();

router.post("/", AddCustomer);
router.get("/", getCustomers);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
