import {User} from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req,res) => {

    const {channelID} = req.query

    // In this controller we will write the functionality of subscribing to the channel.

    const subscription = await Subscription.insertOne({
        subscriber : req.user._id,
        channel: channelID
    });

    if(!subscription){
        throw new ApiError(400, "can't subscribe to this channel");
    }

    res
    .status(200)
    .json(new ApiResponse(200, subscription, "Successfully subscribed to this channel!"))
})


// Controller to return the subscriber list of a channel.
const getUserChannelSubscribers = asyncHandler(async (req, res) => {

    const {channelID} = req.query

    const subscribersList = await Subscription.find({channel : channelID});

    // Note -> subscribersList will be an array of all the subscribers subscribed to the channel
})