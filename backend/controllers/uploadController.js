import { v2 as cloudinary } from "cloudinary"

export const uploadSingleImage = async (req, res) => {
    try {
        const file = req.file
        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' })
        }

        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: 'image',
            folder: 'xoned/assets',
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            transformation: [{ width: 2000, crop: 'limit' }]
        })

        const optimizedUrl = result.secure_url.replace('/upload/', '/upload/f_auto,q_auto,dpr_auto/')

        return res.json({
            success: true,
            url: optimizedUrl,
            publicId: result.public_id,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
            format: result.format
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}



