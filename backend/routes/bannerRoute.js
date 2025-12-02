import express from 'express'
import { getBannerUrl, getAllBanners } from '../controllers/bannerController.js'

const router = express.Router()

// Get capsule banner URL
router.get('/capsule', getBannerUrl)

// Get all banners
router.get('/all', getAllBanners)

export default router

