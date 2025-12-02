import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Clerk user ID
    orderNumber: { type: String, required: true, unique: true }, // Generated order number
    items: [orderItemSchema], // Array of order items
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    address: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        apartment: { type: String, default: '' },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: 'India' }
    },
    status: { 
        type: String, 
        enum: ['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Order Placed' 
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    razorpayOrderId: { type: String }, // Razorpay order ID
    razorpayPaymentId: { type: String }, // Razorpay payment ID
    razorpaySignature: { type: String }, // Razorpay signature
    trackingNumber: { type: String }, // For shipping tracking
    notes: { type: String }, // Additional notes
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Generate order number
orderSchema.pre('save', function(next) {
    if (this.isNew && !this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.orderNumber = `XND-${year}${month}${day}-${random}`;
    }
    this.updatedAt = Date.now();
    next();
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)
export default orderModel;