import express from 'express';
import { AddSale, deleteSale, getSales, updateSale, getSalesReports, chartController, yearlyCharts, weeklyChart } from '../controllers/saleController.js';
const router = express.Router();

router.post('/', AddSale);
router.get('/', getSales);
router.get('/report', getSalesReports);
router.get('/analytics/:year/:month', chartController);
router.get('/analytics/:year', yearlyCharts);
router.get('/analytics/weekly', weeklyChart);
router.put('/:id', updateSale);
router.delete('/:id', deleteSale);




export default router;