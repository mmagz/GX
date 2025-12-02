import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from '../config/mongodb.js'
import productModel from '../models/productModel.js'

// Stock distribution for realistic e-commerce inventory
const stockDistribution = {
  // High stock items (bestsellers, basic items)
  high: [25, 30, 35, 40, 45, 50],
  // Medium stock items (popular but not bestsellers)
  medium: [8, 12, 15, 18, 22, 25],
  // Low stock items (limited editions, seasonal)
  low: [1, 2, 3, 4, 5],
  // Out of stock items (rare or discontinued)
  out: [0]
}

function getStockForProduct(product) {
  // Determine stock based on product characteristics
  if (product.bestseller) {
    // Bestsellers get high stock
    return stockDistribution.high[Math.floor(Math.random() * stockDistribution.high.length)]
  } else if (product.name.toLowerCase().includes('limited') || 
             product.name.toLowerCase().includes('exclusive') ||
             product.category.toLowerCase().includes('accessory')) {
    // Limited/exclusive items and accessories get low stock
    return stockDistribution.low[Math.floor(Math.random() * stockDistribution.low.length)]
  } else if (product.category.toLowerCase().includes('hoodie') || 
             product.category.toLowerCase().includes('t-shirt')) {
    // Basic apparel gets medium stock
    return stockDistribution.medium[Math.floor(Math.random() * stockDistribution.medium.length)]
  } else {
    // Everything else gets random medium to low stock
    const combined = [...stockDistribution.medium, ...stockDistribution.low]
    return combined[Math.floor(Math.random() * combined.length)]
  }
}

async function addStockToProducts() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Get all products
    const products = await productModel.find({})
    console.log(`Found ${products.length} products to update`)

    if (products.length === 0) {
      console.log('No products found to update')
      return
    }

    // Update each product with stock
    let updatedCount = 0
    for (const product of products) {
      const stock = getStockForProduct(product)
      await productModel.updateOne(
        { _id: product._id },
        { $set: { stock } }
      )
      
      console.log(`Updated ${product.name}: ${stock} units`)
      updatedCount++
    }

    console.log(`\n✅ Successfully updated ${updatedCount} products with stock values`)
    
    // Show summary
    const stockSummary = await productModel.aggregate([
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$stock', 0] },
              'Out of Stock',
              {
                $cond: [
                  { $lte: ['$stock', 5] },
                  'Low Stock',
                  {
                    $cond: [
                      { $lte: ['$stock', 15] },
                      'Medium Stock',
                      'High Stock'
                    ]
                  }
                ]
              }
            ]
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    console.log('\n📊 Stock Distribution Summary:')
    stockSummary.forEach(item => {
      console.log(`  ${item._id}: ${item.count} products`)
    })

  } catch (error) {
    console.error('Error adding stock to products:', error)
  } finally {
    mongoose.connection.close()
  }
}

addStockToProducts()








