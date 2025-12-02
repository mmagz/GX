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

// Map filenames to product slugs and variant color buckets
// Adjust colorHex values to match your design system if needed
const productPlans = {
  'basic-hoodie': {
    name: 'Basic Hoodie',
    category: 'HOODIES',
    subCategory: 'ESSENTIALS',
    price: 8999,
    sizes: ['XS','S','M','L','XL','XXL'],
    variants: {
      BLACK: { colorHex: '#000000', files: ['HBk1.JPG', 'HBk2.JPG'] },
      GREEN: { colorHex: '#0f5132', files: ['HG2.JPG', 'hoodiecolourG.JPG'] },
      BROWN: { colorHex: '#654321', files: ['HB1.JPG', 'HB2.JPG'] },
      BLUE:  { colorHex: '#1e3a8a', files: ['blue.JPG', 'blue2.JPG'] }
    }
  },
  'attack-on-titan-hoodie': {
    name: 'Attack on Titan Hoodie',
    category: 'HOODIES',
    subCategory: 'ANIME',
    price: 9999,
    sizes: ['S','M','L','XL'],
    variants: {
      BLACK: { colorHex: '#000000', files: ['AOTH1.JPG', 'AOTH2.JPG'] }
    }
  },
  'one-piece-hoodie': {
    name: 'One Piece Hoodie',
    category: 'HOODIES',
    subCategory: 'ANIME',
    price: 9999,
    sizes: ['S','M','L','XL'],
    variants: {
      BLACK: { colorHex: '#000000', files: ['OP1.JPG', 'OP2.JPG'] }
    }
  },
  'white-graphic-hoodie': {
    name: 'White Graphic Hoodie',
    category: 'HOODIES',
    subCategory: 'GRAPHIC',
    price: 9999,
    sizes: ['S','M','L','XL'],
    variants: {
      WHITE: { colorHex: '#ffffff', files: ['WG1.JPG', 'WG2.JPG', 'WG3.JPG'] }
    }
  }
}

function ensureFilesExist(files) {
  const missing = []
  for (const f of files) {
    const p = path.join(imagesDir, f)
    if (!fs.existsSync(p)) missing.push(f)
  }
  return missing
}

async function main() {
  // Guardrails for env
  const requiredEnv = ['CLOUDINARY_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_SECRET_KEY', 'MONGODB_URI']
  const missingEnv = requiredEnv.filter((k) => !process.env[k])
  if (missingEnv.length) {
    console.error('Missing required env vars:', missingEnv.join(', '))
    process.exit(1)
  }

  // Validate local files
  const allPlannedFiles = Object.values(productPlans).flatMap((p) =>
    Object.values(p.variants).flatMap((v) => v.files)
  )
  const missingFiles = ensureFilesExist(allPlannedFiles)
  if (missingFiles.length) {
    console.error('Missing image files in images directory:', missingFiles)
    process.exit(1)
  }

  // Connect services
  await connectDB()
  await connectCloudinary()

  const mappingOutput = {} // { filename: url }

  for (const [slug, plan] of Object.entries(productPlans)) {
    const variantDocs = []
    for (const [colorName, variant] of Object.entries(plan.variants)) {
      const uploadedUrls = []
      for (const filename of variant.files) {
        const localPath = path.join(imagesDir, filename)
        const cloudFolder = `xoned/products/${slug}/${colorName}`
        const url = await uploadImage(localPath, cloudFolder)
        uploadedUrls.push(url)
        mappingOutput[filename] = url
      }
      variantDocs.push({ colorName, colorHex: variant.colorHex, images: uploadedUrls })
    }

    // Derive product.image from first variant's first up to 4 images
    const defaultImages = (variantDocs[0]?.images || []).slice(0, 4)

    // Upsert product
    const update = {
      name: plan.name,
      slug,
      description: plan.description || (plan.subCategory === 'ESSENTIALS' ? 'Essential heavyweight hoodie with minimalist styling.' : 'Premium graphic hoodie.'),
      price: plan.price,
      category: plan.category,
      subCategory: plan.subCategory,
      sizes: plan.sizes,
      variants: variantDocs,
      image: defaultImages,
      date: Date.now()
    }

    const existing = await productModel.findOne({ slug })
    if (existing) {
      await productModel.updateOne({ _id: existing._id }, update)
      // no-op
    } else {
      const doc = new productModel(update)
      await doc.save()
    }
  }

  // Write mapping file under backend/uploads
  const uploadsDir = path.join(path.resolve(__dirname, '..'), 'uploads')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
  const mapPath = path.join(uploadsDir, 'cloudinary-map.json')
  fs.writeFileSync(mapPath, JSON.stringify(mappingOutput, null, 2))

  console.log('Upload and product sync complete.')
  console.log('Mapping written to:', mapPath)
}

main()
  .then(() => mongoose.connection.close())
  .catch((err) => {
    console.error(err)
    mongoose.connection.close().finally(() => process.exit(1))
  })



