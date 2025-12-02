import express from 'express';
import { searchProducts, getFilterOptions } from '../controllers/searchController.js';

const searchRouter = express.Router();

searchRouter.get('/products', searchProducts);
searchRouter.get('/filters', getFilterOptions);

export default searchRouter;

