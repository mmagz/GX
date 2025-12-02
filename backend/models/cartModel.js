import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true, 
        unique: true, 
        index: true 
    }, // Clerk user ID
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true 
});

// Update the updatedAt field before saving
cartSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const cartModel = mongoose.models.cart || mongoose.model('cart', cartSchema);
export default cartModel;

