import express from 'express';
import { 
    addToWishlist, 
    removeFromWishlist, 
    getUserWishlist, 
    checkWishlistItem, 
    clearWishlist 
} from '../controllers/wishlistController.js';
import authUser from '../middleware/auth.js';

const wishlistRouter = express.Router();

wishlistRouter.post('/add', authUser, addToWishlist);
wishlistRouter.post('/remove', authUser, removeFromWishlist);
wishlistRouter.post('/get', authUser, getUserWishlist);
wishlistRouter.post('/check', authUser, checkWishlistItem);
wishlistRouter.post('/clear', authUser, clearWishlist);

export default wishlistRouter;

