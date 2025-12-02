import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get banner URL from the uploaded mapping file
export const getBannerUrl = async (req, res) => {
  try {
    const mapPath = path.join(__dirname, '../uploads/capsule-banner-cloudinary-map.json')
    
    if (!fs.existsSync(mapPath)) {
      return res.status(404).json({
        success: false,
        message: 'Banner mapping file not found'
      })
    }

    const bannerData = JSON.parse(fs.readFileSync(mapPath, 'utf8'))
    
    res.json({
      success: true,
      bannerUrl: bannerData.bannerUrl || bannerData['capsule.JPG'],
      lastUpdated: bannerData.lastUpdated
    })
  } catch (error) {
    console.error('Error getting banner URL:', error)
    res.status(500).json({
      success: false,
      message: 'Error retrieving banner URL'
    })
  }
}

// Get all banners (for future expansion)
export const getAllBanners = async (req, res) => {
  try {
    const mapPath = path.join(__dirname, '../uploads/capsule-banner-cloudinary-map.json')
    
    if (!fs.existsSync(mapPath)) {
      return res.status(404).json({
        success: false,
        message: 'Banner mapping file not found'
      })
    }

    const bannerData = JSON.parse(fs.readFileSync(mapPath, 'utf8'))
    
    res.json({
      success: true,
      banners: {
        capsule: {
          url: bannerData.bannerUrl || bannerData['capsule.JPG'],
          lastUpdated: bannerData.lastUpdated
        }
      }
    })
  } catch (error) {
    console.error('Error getting banners:', error)
    res.status(500).json({
      success: false,
      message: 'Error retrieving banners'
    })
  }
}








