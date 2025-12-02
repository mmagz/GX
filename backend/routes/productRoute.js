import express from 'express'
import { listProducts, addProduct, removeProduct, singleProduct, getBySlug, getById, seedProducts, repairProductImages, normalizeProductImages, getProductsByDrop, getCurrentDropProducts } from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.post('/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct);
productRouter.post('/remove',adminAuth,removeProduct);
productRouter.post('/single',singleProduct);
productRouter.get('/list',listProducts)
productRouter.get('/slug/:slug', getBySlug)
productRouter.get('/id/:id', getById)
productRouter.get('/drop/:dropCode', getProductsByDrop)
productRouter.get('/current-drop', getCurrentDropProducts)
productRouter.post('/seed', adminAuth, seedProducts)
// Dev-only seed without auth (guarded by env)
productRouter.post('/seed-dev', (req, res, next) => {
  if (process.env.ALLOW_DEV_SEED === 'true') return next();
  return res.status(403).json({ success:false, message:'Dev seed disabled' });
}, seedProducts)

export default productRouter

// Optional maintenance endpoint (guarded by env) to repair legacy image URLs
productRouter.post('/maintenance/repair-images', (req, res, next) => {
  if (process.env.ALLOW_DEV_SEED === 'true') return next();
  return res.status(403).json({ success:false, message:'Maintenance disabled' });
}, repairProductImages)

productRouter.post('/maintenance/normalize-images', (req, res, next) => {
  if (process.env.ALLOW_DEV_SEED === 'true') return next();
  return res.status(403).json({ success:false, message:'Maintenance disabled' });
}, normalizeProductImages)