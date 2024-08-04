import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// register functionality
const registerUser = asyncHandler( async (req, res) => {

    // res.status(200).json({
    //     message: "ok"
    // })

    // steps to register the user....
    // get user details from frontend.
    // validation - not empty.
    // check if user already exists: username, email
    // check for images, check for avatar.
    // upload them to cloudinary, avatar.
    // create user object - create entry in db
    // remove password and refresh token field from response.
    // check for user creation
    // return res.

    // hume req.body se pura form data mil jaayega...
    // console.log(req, "....................request");

    const {fullName, email, userName, password} = req.body
    console.log("email ", email);

    // Now we will do validation waala part...
    if (fullName === "" ){
        throw new ApiError(400, "fullname is required")
    }


    // Another advanced method of doing validation...
    if([fullName, email, userName, password].some((field) => 
    field.trim() === "")){
        throw new ApiError(400, "All fields are required!");
    }

    // Now checking if the user already exists or not.

    // Since humare paas user model, so we can interact with the database using this model.
    // Now we will check if same email ka user exist or not...

    // We will check iss se milta hua ya to username mil jaaye ya fir email mil jaaye.
    const existedUser = await User.findOne({
        $or: [{userName}, {email}]
    });

    if( existedUser ){
        throw new ApiError(409, "User with email or username already exists");   
     }

    // Checking for images and avatar
    // Since humne middleware use kiya, so because of that we have access to req.files

    // console.log(req.files, "...................req.files");

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    // Since avatar is required....
    if(!avatarLocalPath) throw new ApiError(400, "Avatar is necessary");

     // Now hum humare avatar and coverImage ko cloudinary par upload karayenge.
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required!");
    }

    console.log(coverImage, ".........................coverImage");
    console.log(avatar, ".............................avatar");

    // Now creating the entry of the user in the database...

    // Since database is in the other continent, so await lagana padega.

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })

    // Since mongoDB har ek entry field ke saath _id naam ka data field add kar deta hai.
    
    // Now we will remove password and refresh token from the user.
    // select ke andar jo jo nahi chahiye wo wo likhte hain...
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user!");
    }

    // // Now since the user is created, we will send the response.
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        console.log(user, "..................user");
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        console.log(accessToken, "////////////", refreshToken, "////////////////");
        
        // hum refresh token ko db me save karenge.
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});  // hum jab user ko save karte hain, for eg aur required fields bhi kick in ho jaate hain, so hum validation step ko bypass kar dete hain.

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong!");
    }
}

// login functionality
const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send these tokens in cookies 
    // send the response

    const {email, userName, password} = req.body;
    // console.log(password, ".........................password");
    // console.log(userName, ".........................userName");
    // console.log(email, "............................email");


    // username or email dono me se koi ek to chahiye hi.
    if(!(userName || email)){
        throw new ApiError(400, "username or email is required!");
    }

    const user = await User.findOne({
        $or: [{userName}, {email}]
    })

    //  If user mila hi nahi...
    if(!user){
        throw new ApiError(404, "User does not exist!");
    }

    // Now password check...
    // Note -> findOne, deleteOne yeh jo bhi methods hain, yeh User model ke pass available hain, jo ki humne import karaya hai.
    // aur jo methods humne user.models.js me banaye the wo humare waale user ke paas available hai jo ki hume database se mila hai.

    const isPasswordValid =  user.isPasswordCorrect(password);
    // console.log("password", isPasswordValid)
    if(!isPasswordValid){
        throw new ApiError(404, "Invalid user credentials!");
    }

    // Now we will make access and refresh token. Now hum access and refresh token itni baar banayenge so hum unhe ek alag method me daal dete hain.
    
    // Since ye lso async method hai, and it can also take time to execute so insert await.
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    // console.log(accessToken, "...........", refreshToken, "..............");

    // Now we will send the access as well as he refresh tokens in the cookies.
    
    // first we will take the access of updated user jike paas refresh token bhi hai.
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // cookies bhejne ke liye kuch options define karne padte hain.
    const options = {
        httpOnly: true,  // Yeh karne se humari cookies only server se modify ho sakti hain, frontend se nahi.
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)  // hum yahan par cookie access isliye kar paa rahe hain, beacause humne cookie parser ka use kiya hai.
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, refreshToken,  // hum log access token and refresh token api response me bhi bhejenge because ho sakta hai user ko local storage me save karana ho tokens ko.
                    accessToken
                },
                "User LoggedIn Successfully!"
            )
        )

        // Note -> hum hum req me bhi cookie access kar sakte hain.
        // So hum jo middleware bna rahe hain wo hum req me access kar sakte hain, jaise humne multer ke through req.files kiya tha.
})

// logout functionality
const logoutUser = asyncHandler(async (req, res) => {

    // Logout karne ke liye ek to cookies clear krani padegi and hume db me refresh token ko bhi khaali karna padega.
    
    // Now middleware use karne ke baad we have the access of req.user
    
    // Sabse pehle user nikalo id se and then uska refresh token clear karao and then update it to the db.
    // Inn sab cheezon ka ek easy way hai.
    await User.findByIdAndUpdate(
        req.user._id,
        // What to update? We have the set operation fro that...
        {
            $set: {
                refreshToken: undefined
            }
        },

        {
            new: true // Now ab jab mai response return karunga then mujhe new return value milegi.
        }
    )

    const options = {
        httpOnly: true,  // Yeh karne se humari cookies only server se modify ho sakti hain, frontend se nahi.
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User Logged Out Successfully!"))

})


const refreshAccessToken = asyncHandler(async (req, res) => {

    // hum refresh token ko cookies se access kar sakte hain.
    const incomingRefreshtoken = req.cookies?.refreshToken || req.body.refreshToken

    if(!incomingRefreshtoken){
        throw new ApiError(401, "unauthorized request")
    }

    // Now verifying the incoming token...
    // We will get the decoded token from here.
    const decodedToken = jwt.verify(incomingRefreshtoken, process.env.REFRESH_TOKEN_SECRET)
    console.log(decodedToken, "...............decodedToken");
    // Now my refresh token has got decoded, and in the refresh token I have the id. From that id I can query the database.

    const user = await User.findById(decodedToken?._id)

    if(!user) {
        throw new ApiError(401, "unauthorized request");
    }

    // Now matching the incoming refresh token with the refresh token stored in the db.
    if(incomingRefreshtoken !== user?.refreshToken){
        throw new ApiError(401, "Refresh Token is expired or used.");
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    console.log(user, "..................user");

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    console.log(accessToken, "......................accessToken");
    console.log(refreshToken, ".....................refreshToken");


    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {accessToken: accessToken, refreshToken: refreshToken}, "Access token refreshed")
    )


})

const changeCurrentPassword = asyncHandler( async (req, res) => {

    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old Password");
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully!"))
})


// If we want to get access of the current user.
const getcurrentUser = asyncHandler(async (req, res) => {

    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User fetched Successfully!"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {

    const {fullName, email} = req.body

    // We want both fullName as well as the email.
    if (!fullName || !email){
        throw new ApiError(400, "All fields are required!");
    }

    console.log(fullName, "//////////////", email, "////////////////////////");

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        {new : true}
    ).select("-password")

    console.log(user, "...................user ////////////");

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account Details Updated Successfully!"))
})


// file update karne ke liye alsg hi function banayenge, because hum n/w me congestion nahi karna chahate, just we want to update the files nothing else.
// We need two middlewares before this one multer for uploading the file and other only loggedin user can upload the file.

const updateUserAvatar = asyncHandler( async (req, res) => {

    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400, "Error while uploading on avatar!")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "avatar updated successfully!")
    )
})

const updateUserCoverImage = asyncHandler( async (req, res) => {

    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath) {
        throw new ApiError(400, "Cover Image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400, "Error while uploading on avatar!")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "cover image updated successfully!")
    )
})

const getUserChannelProfile = asyncHandler(async(req, res) => {

    const {userName} = req.params

    if (!userName?.trim()){
        throw new ApiError(400, "username is missing!");
    }

    // We can also write the query to find the user on the basis of username.
    // But we will be using the aggregation pipelines.

    const channel = await User.aggregate([
        {
            $match: {
                userName: userName?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions", // When we will be referring the model it will be converted to the lower case and in the plural form. 
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions", // When we will be referring the model it will be converted to the lower case and in the plural form. 
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        // Now we will be adding the additional fields...
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers" // size is used for the counting purpose.
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },

                // adding one more field that the user is subscribed to the channel or not.
                isSubscribed: {
                    $cond: {  // Inside the condition there are three things if, then and else.
                        if: {$in : [req.user?.id, "$subscribers.subscriber"]}, // this in can check in both arrays as well as in objects.
                        then: true,
                        else: false
                    }
                }
            }
        },
        {  // project is used to select the fields which we want to show or not.
            $project: {
                fullName: 1,
                userName: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }

    ])  // The output of aggregate is generally an array.

    if(!channel?.length){
        throw new ApiError(404, "Channel does not exists")
    }

    return res
    .status(200)
    .json(new ApiError(200, channel[0], "user channel fetched successfully!"))

})

const getWatchHistory = asyncHandler(async (req, res) => {

   // req.user._id   // from this we are getting the id as string. But when we use the methods this string is automatically 
   // converted to mongoDB object id, but this is not the case with aggregation pipelines.

   const user = await User.aggregate([
    {
        $match : {
            _id: new mongoose.Types.ObjectId(req.user._id) // here we have to manually convert the id to the mongoose object id.
        },

        $lookup: {
            from: "videos",
            localField: "watchHistory",
            foreignField: "_id",
            as: "watchHistory",
            // We have to use the nested pipelines.
            pipeline: [
                {
                    $lookup : {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                        pipeline : [
                            {
                                $project: {
                                    fullName: 1,
                                    userName: 1,
                                    avatar: 1,
                                }
                            }
                        ]
                    }
                }, // Since the result of this in the owner field would be an array, and in that array there would be only one element
                {
                    $addFields : { // To make that one element out of the array this pipeline is made.
                        owner : {// owner waali field ko hi replace kar dega.
                            $first : "$owner"
                        }
                    }
                }
            ]
        }
    }
   ])

   return res
   .status(200)
   .json(
       new ApiResponse(
           200,
           user[0].watchHistory,
           "watched history fetched successfully!"
       )
   )

})

export {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getcurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory}