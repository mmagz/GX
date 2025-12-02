import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from '../config/mongodb.js'
import productModel from '../models/productModel.js'

async function updateProductsWithDropCode() {
    try {
        await connectDB()
        
        // Update all existing products to have dropCode 1
        const result = await productModel.updateMany(
            { dropCode: { $exists: false } }, // Find products without dropCode
            { $set: { dropCode: 1 } } // Set dropCode to 1
        )
        
        console.log(`Updated ${result.modifiedCount} products with dropCode 1`)
        
        // Also update any products that might have dropCode as null or undefined
        const result2 = await productModel.updateMany(
            { dropCode: { $in: [null, undefined] } },
            { $set: { dropCode: 1 } }
        )
        
        console.log(`Updated ${result2.modifiedCount} additional products with dropCode 1`)
        
        // Count total products with dropCode 1
        const count = await productModel.countDocuments({ dropCode: 1 })
        console.log(`Total products with dropCode 1: ${count}`)
        
    } catch (error) {
        console.error('Error updating products with dropCode:', error)
    } finally {
        mongoose.connection.close()
    }
}

updateProductsWithDropCode()
