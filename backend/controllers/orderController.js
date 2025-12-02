import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Cart from "../models/cartModel.js";
import CartItem from "../models/cartItemModel.js";
import productModel from "../models/productModel.js";
import Stripe from 'stripe'
import razorpay from 'razorpay'

// global variables
const currency = 'inr'
const deliveryCharge = 10

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET,
})

// Placing orders using COD Method
const placeOrder = async (req,res) => {
    
    try {
        
        const { userId, items, amount, address} = req.body;

        // Decrement stock for each item
        for (const item of items) {
            await productModel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } }
            );
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true,message:"Order Placed"})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders using Stripe Method
const placeOrderStripe = async (req,res) => {
    try {
        
        const { userId, items, amount, address} = req.body
        const { origin } = req.headers;

        // Decrement stock for each item
        for (const item of items) {
            await productModel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } }
            );
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"Stripe",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency:currency,
                product_data: {
                    name:item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency:currency,
                product_data: {
                    name:'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:  `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({success:true,session_url:session.url});

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Verify Stripe 
const verifyStripe = async (req,res) => {

    const { orderId, success, userId } = req.body

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true});
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, address, subtotal, shipping, tax, total } = req.body;

        if (!userId || !address || !subtotal || !total) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Get user's cart items
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const cartItems = await CartItem.find({ cartId: cart._id });
        if (cartItems.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // Get product details for each cart item
        const orderItems = await Promise.all(
            cartItems.map(async (item) => {
                const product = await productModel.findById(item.productId);
                return {
                    productId: item.productId,
                    name: product?.name || 'Product',
                    price: product?.price || 0,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                    image: product?.image?.[0] || '',
                    category: product?.category || 'GENERAL'
                };
            })
        );

        const orderData = {
            userId,
            items: orderItems,
            subtotal,
            shipping: shipping || 0,
            tax,
            total,
            address,
            paymentMethod: "Razorpay",
            paymentStatus: "pending"
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Decrement stock for each item
        for (const item of orderItems) {
            await productModel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } }
            );
        }

        const options = {
            amount: total * 100, // Amount in paise
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
            notes: {
                orderNumber: newOrder.orderNumber,
                userId: userId
            }
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);
        
        // Update order with Razorpay order ID
        await orderModel.findByIdAndUpdate(newOrder._id, { 
            razorpayOrderId: razorpayOrder.id 
        });

        res.json({ 
            success: true, 
            order: razorpayOrder,
            orderId: newOrder._id,
            orderNumber: newOrder.orderNumber
        });

    } catch (error) {
        console.error('Razorpay order creation error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const verifyRazorpay = async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature, 
            userId 
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required payment verification data' 
            });
        }

        // Verify the payment signature
        const crypto = require('crypto');
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid payment signature' 
            });
        }

        // Find the order
        const order = await orderModel.findOne({ 
            razorpayOrderId: razorpay_order_id,
            userId: userId 
        });

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }

        // Update order with payment details
        await orderModel.findByIdAndUpdate(order._id, {
            paymentStatus: 'paid',
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            status: 'Confirmed',
            updatedAt: Date.now()
        });

        // Clear user's cart
        const cart = await Cart.findOne({ userId });
        if (cart) {
            await CartItem.deleteMany({ cartId: cart._id });
        }

        res.json({ 
            success: true, 
            message: "Payment Successful",
            orderNumber: order.orderNumber,
            orderId: order._id
        });

    } catch (error) {
        console.error('Razorpay verification error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// All Orders data for Admin Panel
const allOrders = async (req,res) => {

    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// User Order Data For Forntend
const userOrders = async (req,res) => {
    try {
        
        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        
        const { orderId, status } = req.body

        // Get the current order to check if it was cancelled
        const currentOrder = await orderModel.findById(orderId);
        if (!currentOrder) {
            return res.json({success:false,message:'Order not found'});
        }

        // If changing to cancelled, restore stock
        if (status === 'Cancelled' && currentOrder.status !== 'Cancelled') {
            for (const item of currentOrder.items) {
                await productModel.findByIdAndUpdate(
                    item.productId,
                    { $inc: { stock: item.quantity } }
                );
            }
        }

        // If changing from cancelled to another status, decrement stock again
        if (currentOrder.status === 'Cancelled' && status !== 'Cancelled') {
            for (const item of currentOrder.items) {
                await productModel.findByIdAndUpdate(
                    item.productId,
                    { $inc: { stock: -item.quantity } }
                );
            }
        }

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true,message:'Status Updated'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Simulate payment for testing
const simulatePayment = async (req, res) => {
    try {
        const { userId, address, subtotal, shipping, tax, total } = req.body;

        if (!userId || !address || !total) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        // Fetch cart items from database
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(400).json({ 
                success: false, 
                message: 'No cart found' 
            });
        }

        const cartItems = await CartItem.find({ cartId: cart._id });
        if (cartItems.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cart is empty' 
            });
        }

        // Fetch product details for each cart item
        const productIds = cartItems.map(item => item.productId);
        const products = await productModel.find({ _id: { $in: productIds } });
        const productMap = {};
        products.forEach(product => {
            productMap[product._id.toString()] = product;
        });

        // Create order items with detailed product information
        const orderItems = cartItems.map(item => {
            const product = productMap[item.productId];
            if (!product) {
                throw new Error(`Product not found for ID: ${item.productId}`);
            }
            return {
                productId: product._id.toString(),
                name: product.name || 'Unknown Product',
                price: product.price || 0,
                quantity: item.quantity || 1,
                size: item.size || 'One Size',
                color: item.color || 'Default',
                image: (product.image && product.image[0]) || '/placeholder-product.jpg',
                category: product.category || 'General'
            };
        });

        // Generate order number
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const orderNumber = `XND-${year}${month}${day}-${random}`;

        // Create new order
        const newOrder = new orderModel({
            userId,
            orderNumber,
            address: {
                firstName: address.firstName,
                lastName: address.lastName,
                email: address.email,
                phone: address.phone,
                address: address.address,
                apartment: address.apartment,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                country: address.country || 'India'
            },
            items: orderItems,
            subtotal,
            shipping,
            tax,
            total,
            paymentMethod: 'razorpay',
            paymentStatus: 'paid',
            status: 'Order Placed',
            razorpayOrderId: `sim_${Date.now()}`,
            razorpayPaymentId: `sim_pay_${Date.now()}`,
            razorpaySignature: 'simulated_signature'
        });

        await newOrder.save();

        // Decrement stock for each item
        for (const item of orderItems) {
            await productModel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } }
            );
        }

        // Clear cart items
        await CartItem.deleteMany({ cartId: cart._id });

        res.json({
            success: true,
            message: 'Order placed successfully',
            orderNumber: newOrder.orderNumber,
            orderId: newOrder._id
        });

    } catch (error) {
        console.error('Simulate payment error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

export {verifyRazorpay, verifyStripe ,placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, simulatePayment}