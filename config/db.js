import mongoose from "mongoose";
export const connectDB=async() => {
    const DB_PASS=process.env.DB_PASS ||'mongodb://127.0.0.1/storeDB'
    try {
        await mongoose.connect(DB_PASS)
        console.log("mongo connected");  
    } catch (error) {
        console.log(error.message);
        process.exit()
    }
}