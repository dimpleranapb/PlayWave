import express from "express";
import { upload } from "../middlewares/multer.middleware";
import verifyJWT from "../middlewares/auth.middleware";

const router = express.Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );



export default router;