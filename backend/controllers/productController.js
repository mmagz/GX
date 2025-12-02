import { v2 as cloudinary } from "cloudinary"
import fs from 'fs'
import path from 'path'
import productModel from "../models/productModel.js"

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, slug, description, price, category, subCategory, sizes, variants, bestseller, details, care, sizingFit, sizeGuide, dropCode } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        // Upload with automatic format/quality and delivery transformations for frontend optimization
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, {
                    resource_type: 'image',
                    folder: 'xoned/products',
                    use_filename: true,
                    unique_filename: false,
                    overwrite: true,
                    transformation: [
                        // Normalize very large uploads on ingest to a reasonable max width (e.g., 2000px)
                        { width: 2000, crop: 'limit' }
                    ]
                });

                // Build a delivery URL with f_auto,q_auto,dpr_auto for optimal frontend performance
                // Consumers can further transform by appending Cloudinary params as needed.
                const optimizedUrl = result.secure_url
                    .replace('/upload/', '/upload/f_auto,q_auto,dpr_auto/')

                return optimizedUrl
            })
        )

        const productData = {
            name,
            slug: slug || name.toLowerCase().replace(/\s+/g,'-'),
            description,
            category,
            price: Number(price),
            subCategory,
            dropCode: Number(dropCode) || 1, // Default to drop 1 if not provided
            bestseller: String(bestseller) === "true" ? true : false,
            sizes: Array.isArray(sizes) ? sizes : JSON.parse(sizes || '[]'),
            variants: Array.isArray(variants) ? variants : JSON.parse(variants || '[]'),
            details: Array.isArray(details) ? details : JSON.parse(details || '[]'),
            care: Array.isArray(care) ? care : JSON.parse(care || '[]'),
            sizingFit: sizingFit || '',
            sizeGuide: Array.isArray(sizeGuide) ? sizeGuide : JSON.parse(sizeGuide || '[]'),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        
        const products = await productModel.find({}).sort({ date: -1 });
        res.json({success:true,products})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success:true,product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for get product by slug
const getBySlug = async (req, res) => {
    try {
        const { slug } = req.params
        const product = await productModel.findOne({ slug })
        if (!product) return res.status(404).json({ success:false, message:'Product not found' })
        res.json({ success:true, product })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success:false, message:error.message })
    }
}

// function for get product by id
const getById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await productModel.findById(id)
        if (!product) return res.status(404).json({ success:false, message:'Product not found' })
        res.json({ success:true, product })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success:false, message:error.message })
    }
}

// seed products
const seedProducts = async (req, res) => {
    try {
        const items = [
            {
                name: 'Basic Hoodie',
                slug: 'basic-hoodie',
                description: 'Essential heavyweight hoodie with minimalist styling.',
                price: 8999,
                category: 'HOODIES',
                subCategory: 'ESSENTIALS',
                sizes: ['XS','S','M','L','XL','XXL'],
                variants: [
                    { colorName:'BLACK', colorHex:'#000000', images:['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1080&q=80'] },
                    { colorName:'GREEN', colorHex:'#0f5132', images:['https://images.unsplash.com/photo-1544441893-675973e31985?w=1080&q=80'] },
                    { colorName:'BROWN', colorHex:'#654321', images:['https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1080&q=80'] },
                    { colorName:'BLUE', colorHex:'#1e3a8a', images:['https://images.unsplash.com/photo-1534670007418-fbb7f6cf32d1?w=1080&q=80'] }
                ],
                details:[
                    'Oversized, relaxed fit',
                    'Ribbed cuffs and hem',
                    'Kangaroo pocket with hidden zip compartment',
                    'Subtle embroidered branding on chest',
                    'Adjustable drawstring hood',
                    'Reinforced stitching at stress points'
                ],
                care:[
                    'Machine wash cold with similar colors',
                    'Do not bleach',
                    'Tumble dry low or hang to dry',
                    'Iron on low heat if needed',
                    'Do not dry clean'
                ],
                sizingFit:'Oversized and relaxed. Size down for a fitted look.',
                sizeGuide:[
                    { size:'XS', chest:108, length:68, sleeve:62 },
                    { size:'S', chest:114, length:70, sleeve:64 },
                    { size:'M', chest:120, length:72, sleeve:66 },
                    { size:'L', chest:126, length:74, sleeve:68 },
                    { size:'XL', chest:132, length:76, sleeve:70 },
                    { size:'XXL', chest:138, length:78, sleeve:72 }
                ]
            },
            {
                name:'Shiva Hoodie', slug:'shiva-hoodie', description:'Graphic hoodie featuring Shiva motif.', price:9999, category:'HOODIES', subCategory:'GRAPHIC', sizes:['S','M','L','XL'],
                variants:[{ colorName:'BLACK', colorHex:'#000000', images:['https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1080&q=80'] }],
                details:['Graphic print','Soft brushed interior'],
                care:['Machine wash cold','Do not iron on print'],
                sizingFit:'Regular fit',
                sizeGuide:[{ size:'S', chest:114, length:70, sleeve:64 },{ size:'M', chest:120, length:72, sleeve:66 },{ size:'L', chest:126, length:74, sleeve:68 },{ size:'XL', chest:132, length:76, sleeve:70 }]
            },
            {
                name:'One Piece Hoodie', slug:'one-piece-hoodie', description:'Anime inspired hoodie.', price:9999, category:'HOODIES', subCategory:'ANIME', sizes:['S','M','L','XL'],
                variants:[{ colorName:'BLACK', colorHex:'#000000', images:['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1080&q=80'] }],
                details:['Official inspired artwork','Heavyweight cotton'],
                care:['Wash inside-out','Line dry'],
                sizingFit:'Regular fit',
                sizeGuide:[{ size:'S', chest:114, length:70, sleeve:64 },{ size:'M', chest:120, length:72, sleeve:66 },{ size:'L', chest:126, length:74, sleeve:68 },{ size:'XL', chest:132, length:76, sleeve:70 }]
            },
            {
                name:'Attack on Titan Hoodie', slug:'attack-on-titan-hoodie', description:'AOT inspired hoodie.', price:9999, category:'HOODIES', subCategory:'ANIME', sizes:['S','M','L','XL'],
                variants:[{ colorName:'BLACK', colorHex:'#000000', images:['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1080&q=80'] }],
                details:['Scouting Legion graphic','Ribbed trims'],
                care:['Machine wash cold','Do not bleach'],
                sizingFit:'Regular fit',
                sizeGuide:[{ size:'S', chest:114, length:70, sleeve:64 },{ size:'M', chest:120, length:72, sleeve:66 },{ size:'L', chest:126, length:74, sleeve:68 },{ size:'XL', chest:132, length:76, sleeve:70 }]
            },
            {
                name:'Itachi Locket', slug:'itachi-locket', description:'Pendant for chain.', price:1999, category:'ACCESSORIES', subCategory:'JEWELLERY', sizes:[],
                variants:[{ colorName:'SILVER', colorHex:'#d1d5db', images:['https://images.unsplash.com/photo-1505685296765-3a2736de412f?w=1080&q=80'] }],
                details:['Stainless steel','Hypoallergenic'],
                care:['Wipe with soft cloth'],
                sizingFit:'One size',
                sizeGuide:[]
            },
            {
                name:'AOT Locket', slug:'aot-locket', description:'AOT pendant.', price:1999, category:'ACCESSORIES', subCategory:'JEWELLERY', sizes:[],
                variants:[{ colorName:'SILVER', colorHex:'#d1d5db', images:['https://images.unsplash.com/photo-1505685296765-3a2736de412f?w=1080&q=80'] }],
                details:['Stainless steel','Hypoallergenic'],
                care:['Wipe with soft cloth'],
                sizingFit:'One size',
                sizeGuide:[]
            },
            {
                name:'Jeans Baggy Cargo Pants Gray', slug:'jeans-baggy-cargo-pants-gray', description:'Gray baggy cargo jeans.', price:12999, category:'BOTTOMS', subCategory:'PANTS', sizes:['28','30','32','34','36'],
                variants:[{ colorName:'GRAY', colorHex:'#6b7280', images:['https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1080&q=80'] }],
                details:['Loose fit','Multiple cargo pockets'],
                care:['Machine wash warm','Tumble dry low'],
                sizingFit:'Relaxed fit; size true to waist',
                sizeGuide:[{ size:28, waist:71, inseam:78 },{ size:30, waist:76, inseam:79 },{ size:32, waist:81, inseam:80 },{ size:34, waist:86, inseam:81 },{ size:36, waist:91, inseam:82 }]
            }
        ]

        const created = []
        for (const item of items) {
            const exists = await productModel.findOne({ slug: item.slug })
            if (exists) { created.push(exists); continue; }
            const defaultImage = item.variants?.[0]?.images?.slice(0,4) || []
            const doc = new productModel({
                ...item,
                image: defaultImage,
                date: Date.now()
            })
            await doc.save()
            created.push(doc)
        }
        res.json({ success:true, count: created.length })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success:false, message:error.message })
    }
}

// Get products by drop code
const getProductsByDrop = async (req, res) => {
    try {
        const { dropCode } = req.params;
        const products = await productModel.find({ dropCode: parseInt(dropCode) }).sort({ date: -1 });
        
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products by drop',
            error: error.message
        });
    }
};

// Get current drop products (for featured section)
const getCurrentDropProducts = async (req, res) => {
    try {
        // First get the current drop
        const dropModel = (await import('../models/dropModel.js')).default;
        const currentDrop = await dropModel.findOne({ isCurrent: true });
        
        if (!currentDrop) {
            return res.status(404).json({
                success: false,
                message: 'No current drop found'
            });
        }

        // Get products for current drop
        const products = await productModel.find({ dropCode: currentDrop.dropCode }).sort({ date: -1 });
        
        res.status(200).json({
            success: true,
            products,
            drop: currentDrop
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching current drop products',
            error: error.message
        });
    }
};

export { listProducts, addProduct, removeProduct, singleProduct, getBySlug, getById, seedProducts, getProductsByDrop, getCurrentDropProducts }

// Maintenance: replace legacy asset URLs with new product URLs using mapping file
export const repairProductImages = async (req, res) => {
    try {
        const mapPath = path.resolve(process.cwd(), 'uploads', 'cloudinary-map.json')
        if (!fs.existsSync(mapPath)) {
            return res.status(400).json({ success:false, message:'Mapping file not found at backend/uploads/cloudinary-map.json' })
        }
        const mapping = JSON.parse(fs.readFileSync(mapPath, 'utf-8'))
        const filenameToUrl = new Map(Object.entries(mapping))

        const products = await productModel.find({})
        let updatedCount = 0

        for (const p of products) {
            if (!p.slug) { continue }
            let changed = false
            // Fix top-level images
            if (Array.isArray(p.image)) {
                const newTop = p.image.map((url) => {
                    if (typeof url === 'string' && url.includes('/xoned/assets/')) {
                        const fname = url.split('/').pop()?.split('?')[0]
                        const mapped = fname && (filenameToUrl.get(fname.toUpperCase()) || filenameToUrl.get(fname))
                        if (mapped) { changed = true; return mapped }
                    }
                    return url
                })
                p.image = newTop
            }
            // Fix variants images
            if (Array.isArray(p.variants)) {
                for (const v of p.variants) {
                    if (!Array.isArray(v.images)) continue
                    v.images = v.images.map((url) => {
                        if (typeof url === 'string' && url.includes('/xoned/assets/')) {
                            const fname = url.split('/').pop()?.split('?')[0]
                            const mapped = fname && (filenameToUrl.get(fname.toUpperCase()) || filenameToUrl.get(fname))
                            if (mapped) { changed = true; return mapped }
                        }
                        return url
                    })
                }
            }
            if (changed) { await p.save(); updatedCount++ }
        }

        res.json({ success:true, updatedCount })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success:false, message:error.message })
    }
}

// Maintenance: normalize images
// - Map any legacy asset filenames/URLs to new Cloudinary product URLs using mapping
// - Force product.image to mirror the first variant's images (up to 4)
export const normalizeProductImages = async (req, res) => {
    try {
        const mapPath = path.resolve(process.cwd(), 'uploads', 'cloudinary-map.json')
        const mapping = fs.existsSync(mapPath) ? JSON.parse(fs.readFileSync(mapPath, 'utf-8')) : {}
        const filenameToUrl = new Map(Object.entries(mapping))

        const mapToNewUrl = (val) => {
            if (!val || typeof val !== 'string') return val
            if (val.includes('/xoned/products/')) return val
            const fname = val.split('/').pop()?.split('?')[0]
            if (!fname) return val
            // Try both cases
            return filenameToUrl.get(fname) || filenameToUrl.get(fname.toUpperCase()) || val
        }

        const products = await productModel.find({}).sort({ date: -1 })
        let updatedCount = 0

        for (const p of products) {
            if (!p.slug) continue

            let changed = false

            // Normalize variant images first
            if (Array.isArray(p.variants)) {
                for (const v of p.variants) {
                    if (!Array.isArray(v.images)) continue
                    const mapped = v.images.map(mapToNewUrl)
                    if (JSON.stringify(mapped) !== JSON.stringify(v.images)) {
                        v.images = mapped
                        changed = true
                    }
                }
            }

            // Decide top-level image = first variant images (up to 4) if available
            const firstVariantImgs = p?.variants?.[0]?.images || []
            const desiredTop = firstVariantImgs.slice(0,4)
            if (desiredTop.length > 0) {
                if (JSON.stringify(desiredTop) !== JSON.stringify(p.image)) {
                    p.image = desiredTop
                    changed = true
                }
            } else if (Array.isArray(p.image)) {
                // Otherwise, normalize existing top-level images via mapping
                const mappedTop = p.image.map(mapToNewUrl)
                if (JSON.stringify(mappedTop) !== JSON.stringify(p.image)) {
                    p.image = mappedTop
                    changed = true
                }
            }

            if (changed) { await p.save(); updatedCount++ }
        }

        res.json({ success:true, updatedCount })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success:false, message:error.message })
    }
}