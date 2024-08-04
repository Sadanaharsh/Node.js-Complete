import {Router} from "express"
import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getcurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

//router.route("/register").post(registerUser);

// registerUser hit karne se pehle hum middleware laga denge
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",  // ab jo aapka frontend ka field tha wo bhi avatar naam se hona chahiye.
            maxCount: 1 // maximum mai kitni fields ko lunga.
        },
        {
            name:"coverImage",
            maxCount: 1
        }
    ]),

    registerUser);

router.route("/login").post(loginUser);

// secured routes
// Now I will be injecting the middleware.
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getcurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

// First the user must be logged in and then it should also be able to upload the file.
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/channel/:userName").get(verifyJWT, getUserChannelProfile)

router.route("/history").get(verifyJWT, getWatchHistory)

router.route("/publishVideo").post()





export default router;