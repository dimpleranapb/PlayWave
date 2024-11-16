import mongoose, { isValidObjectId } from "mongoose";
import Subscription from "../models/subscription.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriber = req.user._id;

  if (!channelId) {
    throw new ApiError(400, "channelId is required");
  }

  // Check if a subscription already exists
  const existingSubscription = await Subscription.findOne({
    subscriber,
    channel: channelId,
  });

  if (existingSubscription) {
    await existingSubscription.remove();
    return res
      .status(200)
      .json(new ApiResponse(200, "Channel Unsubscribed Successfully"));
  } else {
    const subscription = await Subscription.create({
      subscriber,
      channel: channelId,
    });

    if (!subscription) {
      throw new ApiError(400, "Something went wrong");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Channel Subscribed Successfully"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) {
    throw new ApiError(400, "channelId is required");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberDetails",
      },
    },
    {
      $unwind: "$subscriberDetails", // Flatten the array of subscriber details
    },
    {
      $project: {
        _id: 0, // Exclude the subscription document ID
        subscriberId: "$subscriberDetails._id",
        name: "$subscriberDetails.name",
        username: "$subscriberDetails.username",
        avatar: "$subscriberDetails.avatar",
        email: 0,
      },
    },
  ]);
  if (subscribers.length === 0) {
    return res
      .status(404)
      .json({ message: "No subscribers found for this channel" });
  }

  // Respond with the list of subscribers
  return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Subscribers fetch Successfully"));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId) {
    throw new ApiError(400, "subscriberId is not required");
  }

  const channels = await Subscription.aggregate([
    {
      $match: {
        subscriber: subscriberId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelDetails",
      },
    },
    {
      $unwind: "$channelDetails",
    },
    {
      $project: {
        _id: 0,
        channelId: "$channelDetails._id",
        name: "$channelDetails.name",
        username: "$channelDetails.username",
        avatar: "$channelDetails.avatar",
        email: 0,
      },
    },
  ]);
  if (channels.length === 0) {
    throw new ApiError(400, "No channels found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channels, "Channel details fetch successfully"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
