import mongoose, { isValidObjectId } from "mongoose";
import Video from "../models/video.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.body;
  //Filtering

  let filters = {};
  if (userId) filters.userId = userId;
  if (query) filters.title = new RegExp(query, "i");


  //Sorting
  let sortOptions = {};
  sortOptions[sortBy] = sortType === "asc" ? 1 : -1;

  const skip = (page -1 )*10

  const videos = await Video.find(filters)
  .sort(sortOptions)
  .skip(skip)
  .limit(Number(limit))

  if (videos.length === 0) {
    throw new ApiError(404, "No videos found");
  }

  res.status(200)
  .json(new ApiResponse(200, videos, "Videos data fetched successfully"))
  
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // Get video, upload to cloudinary, create video

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!videoFile) {
    throw new ApiError(400, "Video upload failed");
  }
  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail upload failed");
  }
  //Create Video
  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: videoFile.duration,
    owner: req.user._id,
  });

  if (!video) {
    throw new ApiError(400, "Fail to Publish Video");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video published successfully"));
});

export { publishAVideo, getAllVideos };
