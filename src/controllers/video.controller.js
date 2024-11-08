import mongoose, { isValidObjectId } from "mongoose";
import Video from "../models/video.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //Filtering

  let filters = {};
  if (userId) filters.userId = userId;
  if (query) filters.title = new RegExp(query, "i");

  //Sorting
  let sortOptions = {};
  sortOptions[sortBy] = sortType === "asc" ? 1 : -1;

  const skip = (page - 1) * 10;

  const videos = await Video.find(filters)
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit))
    .populate("owner",  "username avatar");

  if (videos.length === 0) {
    throw new ApiError(404, "No videos found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos data fetched successfully"));
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

const getVideoById = asyncHandler(async(req, res) => {
  const { videoId } = req.params
  if(!videoId){
    throw new ApiError(400, "Video ID is required");
  }
  const video = await Video.findById(videoId)
  .populate("owner", "username")
  if(!video) {
    throw new ApiError(400, "No video found")
  }
  res
  .status(200)
  .json(new ApiResponse(200, video, "Video fetched successfully"));


})

const deleteVideo = asyncHandler(async(req, res) => {
  const { videoId } = req.params
  if(!videoId){
    throw new ApiError(400, "Video ID is required");
  }

  const video = await Video.findByIdAndDelete(videoId);
  if(!video){
    throw new ApiError(404, "Video not found");
  }

  res.status(200)
  .json(new ApiResponse(200, video, "Video Deleted Successfully "))

})

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  if(!videoId){
    throw new ApiError(400, "Video ID is required");
  }
  //Update video details like title, description, thumbnail
  const{title, description} = req.body
  const thumbnailLocalPath = req.file?.path
  console.log(thumbnailLocalPath)
  if (
    [title, description, thumbnailLocalPath].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
  console.log(thumbnail)
  if(!thumbnail){
    throw new ApiError(400, "Thumbnail Upload Failed");
  }
 const video  = await Video.findByIdAndUpdate(videoId,
  {
    $set: {
      title,
      description,
      thumbnail: thumbnail.url
    }
  },{new:true}
 )
 if (!video) {
  throw new ApiError(404, "Video not found");
}

 res.status(200)
 .json( new ApiResponse(200, video, "Video updated successfully"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params
})

export { publishAVideo, getAllVideos, getVideoById, deleteVideo, updateVideo };
