import mongoose, { isValidObjectId } from "mongoose";
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
    .json(new ApiResponse(200, "Tweet Created Successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
