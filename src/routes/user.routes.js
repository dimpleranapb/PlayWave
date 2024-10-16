import express from "express";
import {loginUser, registerUser, logoutUser, refreshAccessToken} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(
  loginUser
)

router.route("/refresh-token").post(refreshAccessToken)

//Secure Routes
router.route("/logout").post( verifyJWT, logoutUser)
export default router;
