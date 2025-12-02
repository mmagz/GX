import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from '../config/mongodb.js'
import dropModel from '../models/dropModel.js'

async function seedDropData() {
    try {
        await connectDB()
        
        // Clear existing drops
        await dropModel.deleteMany({})
        
        // Create initial drop
        const drop1 = new dropModel({
            dropCode: 1,
            name: 'カプセル',
            title: 'カプセル',
            description: 'A curated selection of essential pieces. Where tradition meets contemporary streetwear.',
            season: 'WINTER 2025',
            date: 'January 2025',
            bannerUrl: 'https://res.cloudinary.com/djmywljxv/image/upload/f_auto,q_auto,dpr_auto/v1760432071/xoned/banners/capsule.jpg',
            status: 'ACTIVE',
            isCurrent: true,
            productCount: 0
        })
        
        await drop1.save()
        
        console.log('Drop data seeded successfully!')
        console.log('Created Drop 1:', drop1)
        
    } catch (error) {
        console.error('Error seeding drop data:', error)
    } finally {
        mongoose.connection.close()
    }
}

seedDropData()
