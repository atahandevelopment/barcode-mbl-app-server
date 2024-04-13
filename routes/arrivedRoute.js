import express from "express";
import {
  AddArrivedProduct,
  deleteArrivedProduct,
  getArrivedProducts,
  updateArrivedProduct,
} from "../controllers/arrivedController.js";

const router = express.Router();

router.post("/", AddArrivedProduct);
router.get("/", getArrivedProducts);
router.put("/", updateArrivedProduct);
router.delete("/", deleteArrivedProduct);

export default router;
