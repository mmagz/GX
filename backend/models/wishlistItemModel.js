import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
    wishlistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist', required: true },
    productId: { type: String, required: true }, // Product ID from productModel
    addedAt: { type: Date, default: Date.now }
});

// Ensure unique wishlist items per product within a wishlist
wishlistItemSchema.index({ wishlistId: 1, productId: 1 }, { unique: true });

const WishlistItem = mongoose.models.WishlistItem || mongoose.model('WishlistItem', wishlistItemSchema);
export default WishlistItem;

