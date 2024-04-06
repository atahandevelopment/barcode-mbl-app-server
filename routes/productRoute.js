import express from 'express';
import { AddProduct } from '../controllers/productController.js';

const router = express.Router();

router.post('/new', AddProduct);


export default router;