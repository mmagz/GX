import mongoose from 'mongoose';
import userModel from '../models/userModel.js';
import cartModel from '../models/cartModel.js';
import cartItemModel from '../models/cartItemModel.js';
import 'dotenv/config';

const cleanupCartData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/xoned');
        console.log('Connected to MongoDB');

        // Clean up old cartData from user documents
        console.log('Cleaning up old cartData from user documents...');
        const result = await userModel.updateMany(
            { cartData: { $exists: true } },
            { $unset: { cartData: 1 } }
        );
        console.log(`Cleaned up cartData from ${result.modifiedCount} user documents`);

        // Clear all existing cart and cart item collections (fresh start)
        console.log('Clearing existing cart collections...');
        await cartModel.deleteMany({});
        await cartItemModel.deleteMany({});
        console.log('Cart collections cleared');

        console.log('✅ Cart cleanup completed successfully');
    } catch (error) {
        console.error('❌ Error during cart cleanup:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
};

cleanupCartData();

