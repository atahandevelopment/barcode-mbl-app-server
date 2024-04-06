import express from 'express';
import { AddCustomer, getCustomers } from '../controllers/customers.js';

const router = express.Router();

router.post('/', AddCustomer);
router.get('/deneme', getCustomers)


export default router;