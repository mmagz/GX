import mongoose from 'mongoose';
import userModel from "../models/userModel.js";
import Wishlist from "../models/wishlistModel.js";
import WishlistItem from "../models/wishlistItemModel.js";
import productModel from "../models/productModel.js";

// Helper function to get or create user
const getOrCreateUser = async (clerkUserId) => {
    let user = await userModel.findOne({ clerkUserId });
    if (!user) {
        user = new userModel({
            name: 'User',
            email: `${clerkUserId}@clerk.user`,
            password: 'clerk_managed',
            clerkUserId,
        });
        await user.save();
    }
    return user;
};

// Helper function to get or create wishlist
const getOrCreateWishlist = async (clerkUserId) => {
    let wishlist = await Wishlist.findOne({ userId: clerkUserId });
    if (!wishlist) {
        wishlist = new Wishlist({
            userId: clerkUserId
        });
        await wishlist.save();
    }
    return wishlist;
};

// Add item to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { userId: clerkUserId, productId } = req.body;

        if (!clerkUserId || !productId) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        // Ensure user exists
        await getOrCreateUser(clerkUserId);
        
        // Get or create wishlist
        const wishlist = await getOrCreateWishlist(clerkUserId);
        
        // Check if product exists
        const product = await productModel.findById(new mongoose.Types.ObjectId(productId));
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        // Check if item already exists in wishlist
        const existingItem = await WishlistItem.findOne({
            wishlistId: wishlist._id,
            productId: productId
        });

        if (existingItem) {
            return res.json({ success: false, message: "Item already in wishlist" });
        }

        // Add item to wishlist
        const wishlistItem = new WishlistItem({
            wishlistId: wishlist._id,
            productId: productId
        });

        await wishlistItem.save();

        res.json({ 
            success: true, 
            message: "Added to wishlist",
            wishlistItem 
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Remove item from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { userId: clerkUserId, productId } = req.body;

        if (!clerkUserId || !productId) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        const wishlist = await Wishlist.findOne({ userId: clerkUserId });
        if (!wishlist) {
            return res.json({ success: false, message: "Wishlist not found" });
        }

        const deletedItem = await WishlistItem.findOneAndDelete({
            wishlistId: wishlist._id,
            productId: productId
        });

        if (!deletedItem) {
            return res.json({ success: false, message: "Item not found in wishlist" });
        }

        res.json({ 
            success: true, 
            message: "Removed from wishlist" 
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get user's wishlist
const getUserWishlist = async (req, res) => {
    try {
        const { userId: clerkUserId } = req.body;

        if (!clerkUserId) {
            return res.json({ success: false, message: "Missing user ID" });
        }

        const wishlist = await getOrCreateWishlist(clerkUserId);
        const wishlistItems = await WishlistItem.find({ wishlistId: wishlist._id });

        // Get product details for each wishlist item
        const formattedItems = await Promise.all(
            wishlistItems.map(async (item) => {
                try {
                    const product = await productModel.findById(new mongoose.Types.ObjectId(item.productId));
                    if (product) {
                        return {
                            id: item._id,
                            productId: product._id,
                            name: product.name || 'Product',
                            price: product.price || 0,
                            image: product.image?.[0] || '',
                            category: product.category || 'GENERAL',
                            addedAt: item.addedAt
                        };
                    } else {
                        // Handle case where product was deleted
                        return {
                            id: item._id,
                            productId: item.productId,
                            name: 'Product Not Found',
                            price: 0,
                            image: '',
                            category: 'GENERAL',
                            addedAt: item.addedAt
                        };
                    }
                } catch (error) {
                    console.error(`Error fetching product ${item.productId}:`, error);
                    return {
                        id: item._id,
                        productId: item.productId,
                        name: 'Product Not Found',
                        price: 0,
                        image: '',
                        category: 'GENERAL',
                        addedAt: item.addedAt
                    };
                }
            })
        );

        res.json({ 
            success: true, 
            wishlistItems: formattedItems,
            wishlistId: wishlist._id,
            itemCount: formattedItems.length
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Check if product is in wishlist
const checkWishlistItem = async (req, res) => {
    try {
        const { userId: clerkUserId, productId } = req.body;

        if (!clerkUserId || !productId) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        const wishlist = await Wishlist.findOne({ userId: clerkUserId });
        if (!wishlist) {
            return res.json({ success: true, inWishlist: false });
        }

        const wishlistItem = await WishlistItem.findOne({
            wishlistId: wishlist._id,
            productId: productId
        });

        res.json({ 
            success: true, 
            inWishlist: !!wishlistItem 
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Clear entire wishlist
const clearWishlist = async (req, res) => {
    try {
        const { userId: clerkUserId } = req.body;

        if (!clerkUserId) {
            return res.json({ success: false, message: "Missing user ID" });
        }

        const wishlist = await Wishlist.findOne({ userId: clerkUserId });
        if (!wishlist) {
            return res.json({ success: false, message: "Wishlist not found" });
        }

        await WishlistItem.deleteMany({ wishlistId: wishlist._id });

        res.json({ 
            success: true, 
            message: "Wishlist cleared" 
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { 
    addToWishlist, 
    removeFromWishlist, 
    getUserWishlist, 
    checkWishlistItem, 
    clearWishlist 
};
