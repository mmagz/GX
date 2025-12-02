import userModel from "../models/userModel.js";
import cartModel from "../models/cartModel.js";
import cartItemModel from "../models/cartItemModel.js";
import productModel from "../models/productModel.js";

// Helper function to get or create cart for user
const getOrCreateCart = async (clerkUserId) => {
    let cart = await cartModel.findOne({ userId: clerkUserId });
    
    if (!cart) {
        cart = new cartModel({
            userId: clerkUserId
        });
        await cart.save();
    }
    
    return cart;
};

// Add products to user cart
const addToCart = async (req, res) => {
    try {
        const { userId: clerkUserId, itemId, size, color = 'DEFAULT' } = req.body;

        if (!clerkUserId || !itemId || !size) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        // Get or create cart
        const cart = await getOrCreateCart(clerkUserId);

        // Check if product exists
        const product = await productModel.findById(itemId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        // Check if item already exists in cart
        let cartItem = await cartItemModel.findOne({
            cartId: cart._id,
        
            productId: itemId,
            size,
            color
        });

        if (cartItem) {
            // Update quantity
            cartItem.quantity += 1;
            await cartItem.save();
        } else {
            // Create new cart item
            cartItem = new cartItemModel({
                cartId: cart._id,
                productId: itemId,
                quantity: 1,
                size,
                color
            });
            await cartItem.save();
        }

        res.json({ success: true, message: "Added to cart", cartItem });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update user cart
const updateCart = async (req, res) => {
    try {
        const { userId: clerkUserId, itemId, size, quantity, color = 'DEFAULT' } = req.body;

        if (!clerkUserId || !itemId || !size || quantity < 0) {
            return res.json({ success: false, message: "Missing or invalid fields" });
        }

        const cart = await getOrCreateCart(clerkUserId);

        if (quantity === 0) {
            // Remove item from cart
            await cartItemModel.findOneAndDelete({
                cartId: cart._id,
                productId: itemId,
                size,
                color
            });
            res.json({ success: true, message: "Item removed from cart" });
        } else {
            // Update quantity
            const cartItem = await cartItemModel.findOneAndUpdate(
                {
                    cartId: cart._id,
                    productId: itemId,
                    size,
                    color
                },
                { quantity },
                { new: true, upsert: false }
            );

            if (!cartItem) {
                return res.json({ success: false, message: "Item not found in cart" });
            }

            res.json({ success: true, message: "Cart updated", cartItem });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId: clerkUserId } = req.body;

        if (!clerkUserId) {
            return res.json({ success: false, message: "User ID required" });
        }

        const cart = await getOrCreateCart(clerkUserId);
        
        // Get all cart items
        const cartItems = await cartItemModel.find({ cartId: cart._id });

        // Get product details for each cart item
        const formattedItems = await Promise.all(
            cartItems.map(async (item) => {
                try {
                    const product = await productModel.findById(item.productId);
                    return {
                        id: item._id,
                        productId: item.productId,
                        name: product?.name || 'Product',
                        price: product?.price || 0,
                        image: product?.image?.[0] || product?.image || '',
                        category: product?.category || 'GENERAL',
                        size: item.size,
                        color: item.color,
                        quantity: item.quantity,
                        addedAt: item.addedAt
                    };
                } catch (error) {
                    console.error(`Error fetching product ${item.productId}:`, error);
                    return {
                        id: item._id,
                        productId: item.productId,
                        name: 'Product Not Found',
                        price: 0,
                        image: '',
                        category: 'GENERAL',
                        size: item.size,
                        color: item.color,
                        quantity: item.quantity,
                        addedAt: item.addedAt
                    };
                }
            })
        );

        res.json({ 
            success: true, 
            cartItems: formattedItems,
            cartId: cart._id,
            itemCount: formattedItems.reduce((sum, item) => sum + item.quantity, 0)
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { userId: clerkUserId, itemId, size, color = 'DEFAULT' } = req.body;

        if (!clerkUserId || !itemId || !size) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        const cart = await getOrCreateCart(clerkUserId);

        const deletedItem = await cartItemModel.findOneAndDelete({
            cartId: cart._id,
            productId: itemId,
            size,
            color
        });

        if (!deletedItem) {
            return res.json({ success: false, message: "Item not found in cart" });
        }

        res.json({ success: true, message: "Item removed from cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Clear entire cart
const clearCart = async (req, res) => {
    try {
        const { userId: clerkUserId } = req.body;

        if (!clerkUserId) {
            return res.json({ success: false, message: "User ID required" });
        }

        const cart = await getOrCreateCart(clerkUserId);
        await cartItemModel.deleteMany({ cartId: cart._id });

        res.json({ success: true, message: "Cart cleared" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart, removeFromCart, clearCart };