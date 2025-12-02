import express from 'express';
import { 
    getCurrentDrop, 
    getAllDrops, 
    createDrop, 
    archiveDrop, 
    getArchivedDrops, 
    updateDropStatus 
} from '../controllers/dropController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.get('/current', getCurrentDrop);
router.get('/archived', getArchivedDrops);

// Admin routes
router.get('/all', adminAuth, getAllDrops);
router.post('/create', adminAuth, createDrop);
router.patch('/archive/:dropCode', adminAuth, archiveDrop);
router.patch('/status/:dropCode', adminAuth, updateDropStatus);

export default router;
