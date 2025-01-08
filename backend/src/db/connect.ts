import "dotenv/config"
import mongoose from 'mongoose';

export const connectDb = async (): Promise<void> => {
    try{
        if (process.env.MONGO_URI) {
            console.log("Attempting to connect to database...");
            await mongoose.connect(process.env.MONGO_URI, {});
            console.log("Connected to database");
        } else {
            console.error("MONGO_URI is not defined in environment variables");
            process.exit(1);
        }
    }catch(err){
        console.log(err, "Failed to connect to database");
        process.exit(1);
    }
}