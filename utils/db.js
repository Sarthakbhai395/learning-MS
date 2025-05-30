const mongoose = require('mongoose');
require("dotenv").config();
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI; // Read the connection string from .env
        
        await mongoose.connect(mongoURI + "patelLMS")
        // await mongoose.connect(mongoURI)
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit with failure
    }
};

module.exports = connectDB;