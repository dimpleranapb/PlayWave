import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) {
    throw new ApiError(400, "VideoId is Required");
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
  };

  const comments = await Comment.paginate({ videoId }, options);
  if(!comments) throw new ApiError(404, "No comments found")

  res.status(200).json(new ApiResponse(200, "Comments fetch Successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;
  if (!content.trim()) {
    throw new ApiError(400, "Comment is required ");
  }
  const comment = await Comment.create({
    content,
    video: videoId,
    owner: userId,
  });
  if (!comment) throw new ApiError(404, "Video or user not found");
  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment published successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!content.trim()) {
    throw new ApiError(400, "Content is required for updating the comment");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  console.log(comment.owner);
  console.log(userId);

  if (comment.owner.toString() != userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this comment");
  }

  comment.content = content;
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (!comment.owner.equals(userId)) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
