import express from 'express';
import { AddSale, deleteSale, getSales, updateSale, getSalesReports } from '../controllers/saleController.js';
const router = express.Router();

router.post('/', AddSale);
router.get('/', getSales);
router.get('/report', getSalesReports);
router.put('/:id', updateSale);
router.delete('/:id', deleteSale);




export default router;