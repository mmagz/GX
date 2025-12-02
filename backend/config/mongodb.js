import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("✅ MongoDB Atlas Connected");
        });

        mongoose.connection.on('error', (err) => {
            console.error("❌ MongoDB connection error:", err);
        });

        // Enhanced connection options for Atlas
        const options = {
            serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferCommands: false, // Disable mongoose buffering
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 5, // Maintain a minimum of 5 socket connections
            maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
            connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
        };

        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log("🚀 MongoDB Atlas connection established");
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB Atlas:", error.message);
        // Don't exit the process, let the server continue without DB
    }
}

export default connectDB;