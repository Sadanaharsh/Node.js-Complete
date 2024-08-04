// Ye middleware sirf verify karega ki user hai ya nahi hai.

import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

// jab bhi middleware likho next humesha likho 

// // Kayi baar hume res ki zaroorat hi nahi padti function ke andar, so in place of res we can insert - (dash).
// export const verifyJWT = asyncHandler( async (req, res, next) => {

//     // req ke paas cookies ka access hai as well as header ka bhi hota hai.
//     // hum req ke header me authorization keyword lagake and uski value me Bearer lagake uss token ko bhejte hain.
//     try {
//         const token = req.cookies?.accessToken || req.header.Authorization?.replace("Bearer ", "")

//     if(!token) {
//         throw new ApiError(401, "Unauthorized request");
//     }

//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

//     const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

//     if(!user){
//         // discussion about frontend.
//         throw new ApiError(401, "Invalid Access Token!")
//     }

//     // Now hum req ke andar user ka access de denge.
//     req.user = user;
//     next();
//     } 
//     catch (error) {
//         throw new ApiError(401, error?.message || "Invalid access token!");
//     }
//     })

// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken"
// import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        console.log(req,'..........req')

       // const token = req.headers.authorization?.replace("Bearer ", "")
       const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
       
       console.log(token, "......................token");
        
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        console.log(decodedToken, "...................decodedToken");
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        console.log(user, "..................user");

        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})