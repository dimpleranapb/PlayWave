import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Like from "../models/like.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) throw new ApiError(400, "VideoId is required");
  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  if (existingLike) {
    existingLike.video = null;
    existingLike.save();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Video unLiked successfully"));
  }

  const newLike = await Like.create({
    video: videoId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newLike, "Video liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) throw new ApiError(400, "CommentId is required");
  const existingComment = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (existingComment) {
    existingComment.comment = null;
    existingComment.save();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Comment unLiked successfully"));
  }

  const newLike = await Like.create({
    comment: commentId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newLike, "Comment liked successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId) throw new ApiError(400, "TweetId is required");

  const existingTweet = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  if (existingTweet) {
    existingTweet.tweet = null;
    if (!existingLike.video && !existingLike.comment) {
      await existingLike.remove();
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Tweet unliked successfully"));
    }
    existingTweet.save();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Tweet unLiked successfully"));
  }

  const newLike = await Like.create({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newLike, "Tweet liked successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const videos = await Like.aggregate([
    {
      $match: { likedBy: userId },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
    {
      $unwind: "$likedVideos",
    },
  ]);
  if (!videos.length) throw new ApiError(404, "Videos not found");
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Liked videos data fetch successfully"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
