import mongoose, { isValidObjectId, Mongoose } from "mongoose";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import Tweet from "../models/tweet.model.js";

const createTweet = asyncHandler(async (req, res) => {
  let { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content cannot be blank");
  }
  const tweet = await Tweet.create({
    content: content.trim(),
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet Created Successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "UserId is not a valid ObjectId");
  }
  const tweets = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        content: 1,
      },
    },
  ]);
  if (!tweets.length) {
    throw new ApiError(404, "No tweets Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User tweets fetch successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "tweetId is not a valid ObjectId");
  }
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content cannot be blank");
  }
  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this tweet");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      content: content.trim(),
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated Successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "tweetId is not a valid ObjectId");
  }
  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this tweet");
  }
  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);
  if (!deletedTweet) {
    throw new ApiError(404, "Tweet not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, deletedTweet, "Tweet deleted Successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
