import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcrypt"; // Ensure bcrypt is installed

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // Validate fields
  if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  // Validate and upload images
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

  if (!avatar) {
    throw new ApiError(400, "Avatar image upload failed");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password: hashedPassword,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken"); //Unselect password and refresh token Before sending object
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export default registerUser;
