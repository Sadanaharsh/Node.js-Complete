import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
// import dotenv from "dotenv"

// dotenv.config({
//  path: './env'
//})

const connectDB = async () => {
    try {
        // mongoose aapko ek returned object deta hai, and usse hum ek variable me bhi store kar sakte hain.
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB Host : ${connectionInstance.connection.host}`)
       // console.log(connectionInstance);
    } catch (error) {
        console.log("MongoDB connection failed : ", error);
        process.exit(1);   //NodeJs me hume process ka access milta hai.

        process.exit(1) // denotes failure and stops the furthur process.
       // process.exit(0) It denotes success.
    }
}

export default connectDB;
