import mongoose from 'mongoose';

export const connectDB = async () => {;
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);// Log the host of the connected MongoDB
        
    } catch (e) {
        console.error(`Error: ${e.message}`);
        process.exit(1);// Exit process with failure(something failed);
    }
}