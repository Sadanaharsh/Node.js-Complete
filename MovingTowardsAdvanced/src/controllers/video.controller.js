import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const publishVideo = asyncHandler( async(req, res) => {

    // Logic to publish the video....

    // first of all the user must be logged in and after that only he can publish the video.

    const {title, description} = req.body

    console.log(req.body, ".......................body");
    console.log(req.files, ".......................files");

    const videoFileLocalPath = req.files?.videoFile[0]?.path;

    if(!videoFileLocalPath){
        throw new ApiError(400, "Video File is necessary!");
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if(!thumbnailLocalPath){
        throw new ApiError(400, "Video File is necessary!");
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    console.log(videoFile, ".................videoFile");
    console.log(thumbnail, ".................thumbnail");

    const video = await Video.create({
        title,
        description,
        thumbnail: thumbnail.url,
        videofile: videoFile.url,
        owner : req.user._id,
        duration : videoFile.duration
    })

    if(!video) {
        throw new ApiError(500, "Something went wrong!");
    }

    res
    .status(201)
    .json(new ApiResponse(200, video, "Video published successfully!"));

})

const getVideoById = asyncHandler( async (req, res) => {

    console.log(req, ".............request");

    const {videoId} = req.query;

    console.log(videoId, "..............videoId");

    const video = await Video.findById(videoId);

    console.log(video, ".....................video");

    if(!video){
        throw new ApiError(400, "This video does'nt exists!");
    }

    res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched Successfully"));

})

const updateVideo = asyncHandler( async (req, res) => {

    //  We will only be giving the option of updating the video part not the thumbnail part.

    const {videoId} = req.query;

    console.log(videoId, ".......................videoId");

    // Note only the owner can update the video. So here we have reached through the middleware verifyJWT.

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(400, "This video does'nt exists!");
    }

    console.log(video.owner, "....................videoOwner");
    console.log(req.user._id, "...................user id");

    if(!req.user._id.equals(video.owner)){    // To match the mongoose id always use the .equals method.
        throw new ApiError(400, "Video can only be updated by the owner of the video!");
    }

    const videoFileLocalPath = req.files?.path;

    let videoFile;
    
    if(videoFileLocalPath)
     videoFile = await uploadOnCloudinary(videoFileLocalPath);


    const newVideo = await Video.findByIdAndUpdate(videoId,
        {
            videofile : videoFile?.url || video.videofile,
            title: req?.body?.title || video.title,
            description: req?.body?.desription || video.description,
            duration : videoFile?.duration || video.duration
        },
        {
            new : true
        }
    )

    if(!newVideo){
        throw new ApiError(500, "Video can't be updated!");
    }

    res
    .status(200)
    .json(new ApiResponse(200, newVideo, "video updated successfully!"))

})

const deleteVideo = asyncHandler( async (req, res) => {

    const {videoId} = req.query;

    const video = await Video.findById(videoId);

    // Only the loggedin user who is the owner can delete the video...
    if(!req.user._id.equals(video.owner)){
        throw new ApiError(400, "Only the owner of this video can delete the video!");
    }

    // await Video.deleteOne({_id : videoId});

    await Video.findByIdAndDelete(videoId);


    res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully!"));
    
})

export {publishVideo, getVideoById, updateVideo, deleteVideo};