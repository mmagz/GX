import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    colorName: { type: String, required: true },
    colorHex: { type: String, required: true },
    images: { type: [String], default: [] }
}, { _id: false })

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: [String], required: true },
    variants: { type: [variantSchema], default: [] },
    // Drop/Capsule linking
    dropCode: { type: Number, required: true },
    // Commerce UX fields
    details: { type: [String], default: [] },
    care: { type: [String], default: [] },
    sizingFit: { type: String, default: '' },
    sizeGuide: {
        type: [
            {
                size: String,
                chest: Number,
                length: Number,
                sleeve: Number,
                waist: Number,
                inseam: Number,
            }
        ],
        default: []
    },
    bestseller: { type: Boolean, default: false },
    stock: { type: Number, default: 0 },
    date: { type: Number, required: true }
})

const productModel  = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel