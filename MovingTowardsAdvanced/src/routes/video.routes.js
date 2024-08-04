import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { publishVideo, getVideoById, updateVideo, deleteVideo } from "../controllers/video.controller.js";

const router = Router();

router.route("/post-video").post(verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),

    publishVideo
)

router.route("/get-video/").get(getVideoById);

router.route("/update-video").post(verifyJWT, upload.single("videofile"), updateVideo)

router.route("/delete-video").delete(verifyJWT, deleteVideo);


export default router;