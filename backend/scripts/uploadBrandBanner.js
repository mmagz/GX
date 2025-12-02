import 'dotenv/config'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'

// Local imports from backend
import connectDB from '../config/mongodb.js'
import connectCloudinary from '../config/cloudinary.js'

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
      { width: 1920, crop: 'limit' }, // Optimize for banner width
      { quality: 'auto:best' },
      { fetch_format: 'auto' },
      { dpr: 'auto' }
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

  // Check if brand banner image exists
  const brandImage = 'brandbanner.JPG'
  const imagePath = path.join(imagesDir, brandImage)

  if (!fs.existsSync(imagePath)) {
    console.error('Brand banner image not found at:', imagePath)
    process.exit(1)
  }

  // Connect services
  await connectDB()
  await connectCloudinary()

  console.log('Uploading brand banner to Cloudinary...')

  try {
    // Upload the banner image
    const cloudFolder = 'xoned/banners'
    const bannerUrl = await uploadImage(imagePath, cloudFolder)
    console.log(`Uploaded ${brandImage} -> ${bannerUrl}`)

    // Write mapping to file
    const mappingOutput = {
      [brandImage]: bannerUrl,
      bannerUrl: bannerUrl,
      lastUpdated: new Date().toISOString()
    }

    const uploadsDir = path.join(path.resolve(__dirname, '..'), 'uploads')
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
    const mapPath = path.join(uploadsDir, 'brand-banner-cloudinary-map.json')
    fs.writeFileSync(mapPath, JSON.stringify(mappingOutput, null, 2))

    console.log('Brand banner upload complete.')
    console.log('Banner URL:', bannerUrl)
    console.log('Mapping written to:', mapPath)
    console.log('You can now use this URL in your frontend for the brand teaser!')

  } catch (error) {
    console.error('Error uploading brand banner:', error)
  }
}

main()
  .then(() => mongoose.connection.close())
  .catch((err) => {
    console.error(err)
    mongoose.connection.close().finally(() => process.exit(1))
  })


