import User from "../models/user.model"
import mongoose, {isValidObjectId} from "mongoose"
import Subscription from "../models/subscription.model"
import ApiError from "../utils/ApiError"
import ApiResponse from "../utils/ApiResponse"
import asyncHandler from "../utils/asyncHandler"





const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriber = req.user._id;

    if (!channelId) {
        throw new ApiError(400, "channelId is required");
    }

    // Check if a subscription already exists
    const existingSubscription = await Subscription.findOne({
        subscriber,
        channel: channelId
    });

    if (existingSubscription) {
        await existingSubscription.remove();
        return res.status(200).json(new ApiResponse(200, "Channel Unsubscribed Successfully"));
    } else {
        const subscription = await Subscription.create({
            subscriber,
            channel: channelId
        });

        if (!subscription) {
            throw new ApiError(400, "Something went wrong");
        }

        return res.status(200).json(new ApiResponse(200, "Channel Subscribed Successfully"));
    }
});


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}