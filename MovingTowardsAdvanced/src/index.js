
// jaise hi aapki file save hoti hai, nodemon server ko restart kar deta hai.
// dependency vs dev dependency....

// dev dependency wo hoti hai jisse hum sirf development ke time par hi use karte hain, yeh prooduction me nahi jaati.
// production me isliye nahi jaati because yeh thodi bhaari hoti hai.
// Jaise nodemon bhi install karna hai then choose option ki yeh dev dependency me install ho -> npm install --save-dev nodemon
// package.json me scripts me bhi change kiya hai.

// Commandline me use touch for making files and mkdir for making the folders.

// controllers me saara logic likhenge, db folder me database se connect karenge and middlewares me beech ka kaam karenge, request aayi and then usko process hone se pehle.
// Jo functionality baar baar repeat hogi usse alag se ek file/folder me rakh diya jaata hai, jisse hum utilities bolte hain.

// Note database is always in the another continent, so while connecting to the database make sure of two things ->
// 1. Use try-catch
// 2. Database se connect karne me time lagta hai, so use async await.

//require('dotenv').config({path: './env'}) // hum path bta rahe hain ki wo root folder me hi padi hui hai. But writing this can break our consistency. 
import dotenv from "dotenv"  // yeh dot env ke liye hum import statements isliye likh paa rahe hain, because humne package.json me experimental add kiya hai.
import mongoose from 'mongoose';
import connectDB from "./db/index.js";

// import express from 'express'
import  {DB_NAME}  from './constants.js';
import { app } from "./app.js";  // Or root directory is index.js and we have imported app from app.js

dotenv.config({
    path: './env'
})

// Note -> Async function always returns us the promise, 
// and if it wants to return the data, the data is wrapped inside the promise and then returned.
connectDB()
.then((data) => {
   // console.log(data, "...........................");

    // It means ki database se connect hone ke baad hum port par listen karenge.
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running at port ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("MongoDB connection failed....", error);
})

// const app = express();

// This is the best practice to connect to the database.
// Generally professional approach hai ki jab bhi log iffi likhte hain then wo starting me semicolon laga dete hain.

// This is the one way to connect to the database.
// ;( async () => {
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        // Sometimes it might be possible ki databse connect ho jaye but app usse baat nhi kar paa rha.
//        app.on("error", (error) => {
//         console.log("ERROR: " , error);
//         throw error
//        })

//        app.listen(process.env.PORT, () => {
//         console.log(`App is listening on 
//             ${process.env.PORT}`);
//        })
//     }
//     catch (error) {
//         console.log("Error:", error);
//         throw err
//     }
// })()


// Second approach is ki hum alag se ek file le and wahan database se connect karein, and then usse export kara lein.


// routes import 
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"

// Pehle hum app.get karte the, but now since humne routes ki ek alag hi file bana di hai, so we use app.use.
// routes declaration

app.use('/api/v1/users', userRouter) // http://localhost:8000/api/v1/users/jo bhi humne userRouter me define kiya hai
app.use('/api/v1/videos', videoRouter)


export {app}

