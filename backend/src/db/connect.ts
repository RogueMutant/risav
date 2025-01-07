require('dotenv').config();
import mongoose from 'mongoose';

export const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI as string,{})
        console.log("Connected to database");
    }catch(err){
        console.log(err, "Failed to connect to database");
        process.exit(1);
    }
}