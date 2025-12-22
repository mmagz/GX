import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import { clerkMiddleware } from '@clerk/express'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import uploadRouter from './routes/uploadRoute.js'
import bannerRouter from './routes/bannerRoute.js'
import dropRouter from './routes/dropRoute.js'
import wishlistRouter from './routes/wishlistRoute.js'
import searchRouter from './routes/searchRoute.js'
import addressRouter from './routes/addressRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
// CORS: allow local dev + configured production origins
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173,https://gx-admin-n49r.onrender.com,https://getxoned-frontend.onrender.com,https://getxoned-admin.onrender.com,https://www.getxoned.com').split(',')
app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true) // allow non-browser tools
        return allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error('Not allowed by CORS'))
    },
    credentials: true,
}))

// Public endpoints (no auth)
app.get('/',(req,res)=>{
    res.send("API Working")
})
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})
app.get('/health/db', async (req, res) => {
    const readyState = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
    const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }
    const startedAt = Date.now()
    let latencyMs = null
    let ok = false
    let error = null

    try {
        // Only attempt ping if a connection object exists
        if (mongoose.connection.db) {
            await mongoose.connection.db.admin().command({ ping: 1 })
            ok = true
        }
        latencyMs = Date.now() - startedAt
    } catch (e) {
        latencyMs = Date.now() - startedAt
        error = e?.message || 'Ping failed'
    }

    res.status(ok && readyState === 1 ? 200 : 503).json({
        ok,
        readyState,
        state: stateMap[readyState] ?? 'unknown',
        latencyMs,
        timestamp: new Date().toISOString(),
        error
    })
})

// Clerk auth (verifies JWTs from frontend) - reads CLERK_SECRET_KEY from env
app.use(clerkMiddleware())

// api endpoints (protected where their own middleware enforces auth/admin)
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/upload',uploadRouter)
app.use('/api/banner',bannerRouter)
app.use('/api/drop',dropRouter)
app.use('/api/wishlist',wishlistRouter)
app.use('/api/search',searchRouter)
app.use('/api/address',addressRouter)

app.listen(port, ()=> console.log('Server started on PORT : '+ port))
