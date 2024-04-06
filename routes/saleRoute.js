import express from 'express';
import { AddSale } from '../controllers/saleController.js';
const router = express.Router();

router.post('/', AddSale);


export default router;