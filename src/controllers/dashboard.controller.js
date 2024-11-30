import mongoose from "mongoose";
import Video from "../models/video.model.js";
import Subscription from "../models/subscription.model.js";
import Like from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const channelId = req.user._id;

  const skip = (page - 1) * Number(limit);
  const channelVideos = await Video.find({ owner: channelId })
    .skip(skip)
    .limit(Number(limit));

  if (channelVideos.length === 0) {
    throw new ApiError(404, "No videos found for this channel");
  }

  const totalVideos = await Video.countDocuments({ owner: channelId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos: channelVideos,
        pagination: {
          totalDocs: totalVideos,
          page: Number(page),
          limit: Number(limit),
        },
      },
      "All videos fetched successfully"
    )
  );
});

export { getChannelStats, getChannelVideos };
