import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    cartId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'cart', 
        required: true 
    },
    productId: { 
        type: String, 
        required: true 
    },
    size: { 
        type: String, 
        required: true 
    },
    color: { 
        type: String, 
        default: 'DEFAULT' 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    addedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Create compound index to prevent duplicate entries
cartItemSchema.index({ cartId: 1, productId: 1, size: 1, color: 1 }, { unique: true });

const cartItemModel = mongoose.models.cartItem || mongoose.model('cartItem', cartItemSchema);
export default cartItemModel;

