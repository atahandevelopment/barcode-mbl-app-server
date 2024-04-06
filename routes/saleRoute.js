import express from 'express';
import { AddSale, deleteSale, getSales, updateSale } from '../controllers/saleController.js';
const router = express.Router();

router.post('/', AddSale);
router.get('/', getSales);
router.put('/:id', updateSale);
router.delete('/:id', deleteSale);




export default router;