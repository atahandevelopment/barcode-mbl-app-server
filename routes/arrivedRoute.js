import express from 'express';
import { AddArrivedProduct, getArrivedProducts } from '../controllers/arrivedController.js';

const router = express.Router();

router.post('/', AddArrivedProduct);
router.get('/', getArrivedProducts);


export default router;