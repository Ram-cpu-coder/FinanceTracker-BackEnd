import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DATABASE CONNECTED")
    } catch (error) {
        console.log("ERROR connecting the database")
    }
}