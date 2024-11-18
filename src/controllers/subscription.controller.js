import mongoose, { isValidObjectId } from "mongoose";
import Subscription from "../models/subscription.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

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
  const { subscriberId } = req.params;

  if (!subscriberId || !mongoose.isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Valid subscriberId is required");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: { channel: new mongoose.Types.ObjectId(subscriberId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberDetails",
      },
    },
    { $unwind: "$subscriberDetails" },
    {
      $project: {
        _id: 0,
        subscriberId: "$subscriberDetails._id",
        name: "$subscriberDetails.name",
        username: "$subscriberDetails.username",
        avatar: "$subscriberDetails.avatar",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribers,
        subscribers.length
          ? "Subscribers fetched successfully"
          : "No subscribers found for this channel"
      )
    );
});

// Controller: Get Channels Subscribed By User
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const subscriber = req.user?._id;

  if (!subscriber) {
    throw new ApiError(401, "Unauthorized access");
  }

  const channels = await Subscription.aggregate([
    {
      $match: { subscriber: new mongoose.Types.ObjectId(subscriber) }, // FIXED
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelDetails",
      },
    },
    { $unwind: "$channelDetails" },
    {
      $project: {
        _id: 0,
        channelId: "$channelDetails._id",
        name: "$channelDetails.name",
        username: "$channelDetails.username",
        avatar: "$channelDetails.avatar",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channels,
        channels.length
          ? "Subscribed channels fetched successfully"
          : "No subscribed channels found"
      )
    );
});
export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
