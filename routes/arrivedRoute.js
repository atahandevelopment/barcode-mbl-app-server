import express from 'express';
import { AddArrivedProduct } from '../controllers/arrivedController.js';

const router = express.Router();

router.post('/', AddArrivedProduct);


export default router;