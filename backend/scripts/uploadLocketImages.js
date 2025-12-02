import 'dotenv/config'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'

// Local imports from backend
import connectDB from '../config/mongodb.js'
import connectCloudinary from '../config/cloudinary.js'
import productModel from '../models/productModel.js'

// Resolve repo root and images dir
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..', '..')
const imagesDir = path.join(repoRoot, 'images')

// Utility: upload one image with standard transformations
async function uploadImage(localPath, folder) {
  const result = await cloudinary.uploader.upload(localPath, {
    resource_type: 'image',
    folder,
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    transformation: [
      { width: 2000, crop: 'limit' } // normalize large originals
    ]
  })
  // Delivery URL with auto format/quality/DPR
  return result.secure_url.replace('/upload/', '/upload/f_auto,q_auto,dpr_auto/')
}

async function main() {
  // Guardrails for env
  const requiredEnv = ['CLOUDINARY_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_SECRET_KEY', 'MONGODB_URI']
  const missingEnv = requiredEnv.filter((k) => !process.env[k])
  if (missingEnv.length) {
    console.error('Missing required env vars:', missingEnv.join(', '))
    process.exit(1)
  }

  // Define locket products and their images
  const locketProducts = [
    {
      slug: 'itachi-locket',
      name: 'Itachi Locket',
      images: ['itachichain.JPG', 'itachicahin2.JPG']
    },
    {
      slug: 'aot-locket', 
      name: 'AOT Locket',
      images: ['AOTchain.JPG', 'AOTchain2.JPG']
    }
  ]

  // Check if all image files exist
  const allImages = locketProducts.flatMap(p => p.images)
  const missingFiles = allImages.filter(f => !fs.existsSync(path.join(imagesDir, f)))
  if (missingFiles.length) {
    console.error('Missing locket image files:', missingFiles)
    process.exit(1)
  }

  // Connect services
  await connectDB()
  await connectCloudinary()

  console.log('Uploading locket images to Cloudinary...')
  
  const mappingOutput = {}

  for (const product of locketProducts) {
    console.log(`\nProcessing ${product.name}...`)
    
    // Upload images for this product
    const uploadedUrls = []
    for (const filename of product.images) {
      const localPath = path.join(imagesDir, filename)
      const cloudFolder = `xoned/products/${product.slug}/SILVER`
      const url = await uploadImage(localPath, cloudFolder)
      uploadedUrls.push(url)
      mappingOutput[filename] = url
      console.log(`  Uploaded ${filename} -> ${url}`)
    }

    // Update the product in database
    const productDoc = await productModel.findOne({ slug: product.slug })
    if (!productDoc) {
      console.error(`${product.name} product not found!`)
      continue
    }

    // Update the product with new images
    productDoc.image = uploadedUrls
    if (productDoc.variants && productDoc.variants.length > 0) {
      productDoc.variants[0].images = uploadedUrls
    }

    await productDoc.save()
    console.log(`  Updated ${product.name} with new images`)
  }

  // Write mapping to file
  const uploadsDir = path.join(path.resolve(__dirname, '..'), 'uploads')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
  const mapPath = path.join(uploadsDir, 'locket-cloudinary-map.json')
  fs.writeFileSync(mapPath, JSON.stringify(mappingOutput, null, 2))

  console.log('\nLocket images upload complete.')
  console.log('Mapping written to:', mapPath)
}

main()
  .then(() => mongoose.connection.close())
  .catch((err) => {
    console.error(err)
    mongoose.connection.close().finally(() => process.exit(1))
  })








