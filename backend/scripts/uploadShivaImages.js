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

  // Check if Shiva images exist
  const shivaImages = ['shiva1.JPG', 'shiva2.JPG']
  const missingFiles = shivaImages.filter(f => !fs.existsSync(path.join(imagesDir, f)))
  if (missingFiles.length) {
    console.error('Missing Shiva image files:', missingFiles)
    process.exit(1)
  }

  // Connect services
  await connectDB()
  await connectCloudinary()

  console.log('Uploading Shiva images to Cloudinary...')
  
  // Upload images
  const uploadedUrls = []
  for (const filename of shivaImages) {
    const localPath = path.join(imagesDir, filename)
    const cloudFolder = `xoned/products/shiva-hoodie/BLACK`
    const url = await uploadImage(localPath, cloudFolder)
    uploadedUrls.push(url)
    console.log(`Uploaded ${filename} -> ${url}`)
  }

  // Update Shiva Hoodie product
  const shivaProduct = await productModel.findOne({ slug: 'shiva-hoodie' })
  if (!shivaProduct) {
    console.error('Shiva Hoodie product not found!')
    process.exit(1)
  }

  // Update the product with new images
  shivaProduct.image = uploadedUrls
  if (shivaProduct.variants && shivaProduct.variants.length > 0) {
    shivaProduct.variants[0].images = uploadedUrls
  }

  await shivaProduct.save()
  console.log('Updated Shiva Hoodie product with new images')

  // Write mapping to file
  const mappingOutput = {}
  shivaImages.forEach((filename, index) => {
    mappingOutput[filename] = uploadedUrls[index]
  })

  const uploadsDir = path.join(path.resolve(__dirname, '..'), 'uploads')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
  const mapPath = path.join(uploadsDir, 'shiva-cloudinary-map.json')
  fs.writeFileSync(mapPath, JSON.stringify(mappingOutput, null, 2))

  console.log('Shiva images upload complete.')
  console.log('Mapping written to:', mapPath)
}

main()
  .then(() => mongoose.connection.close())
  .catch((err) => {
    console.error(err)
    mongoose.connection.close().finally(() => process.exit(1))
  })

