import express from 'express'
import upload from '../middleware/multer.js'
import { uploadSingleImage } from '../controllers/uploadController.js'
import adminAuth from '../middleware/adminAuth.js'

const uploadRouter = express.Router()

// Upload a single image: field name 'image'
uploadRouter.post('/image', adminAuth, upload.single('image'), uploadSingleImage)

export default uploadRouter



