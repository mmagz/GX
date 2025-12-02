import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from '../config/mongodb.js'
import productModel from '../models/productModel.js'

async function cleanupOldProducts() {
    try {
        await connectDB()
        
        // Find products with old asset URLs
        const oldProducts = await productModel.find({
            $or: [
                { 'image': { $regex: '/xoned/assets/' } },
                { 'imagesByColor': { $exists: true } }, // Old structure
                { 'variants': { $exists: false } } // Missing variants array
            ]
        })
        
        console.log(`Found ${oldProducts.length} old products to remove:`)
        oldProducts.forEach(p => {
            console.log(`- ${p.name} (${p._id})`)
        })
        
        if (oldProducts.length > 0) {
            const result = await productModel.deleteMany({
                _id: { $in: oldProducts.map(p => p._id) }
            })
            
            console.log(`Removed ${result.deletedCount} old products`)
        }
        
        // Verify remaining products
        const remaining = await productModel.find({}).sort({ date: -1 })
        console.log(`\nRemaining products (${remaining.length}):`)
        remaining.forEach(p => {
            const hasVariants = p.variants && p.variants.length > 0
            const hasValidImages = p.image && p.image.length > 0 && !p.image[0].includes('/xoned/assets/')
            console.log(`- ${p.name} (${p.slug || 'no-slug'}) - variants: ${hasVariants}, valid images: ${hasValidImages}`)
        })
        
    } catch (error) {
        console.error('Cleanup failed:', error)
    } finally {
        mongoose.connection.close()
    }
}

cleanupOldProducts()

