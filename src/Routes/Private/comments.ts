import { Handler, Router } from "express";
import { verifyAuth } from "../../Middlewares/verifyAuth";
import { Comment } from "../../Models/Comment";
import { UserModelType } from "../../Models/User";
import { Video } from "../../Models/Video";
import { errorMessageWithCode } from "../../Utils/errorMessageWithCode";
import { getNow } from "../../Utils/getNow";

export const commentsRouter = Router();

const addCommentToVideo: Handler = async (req, res, next) => {
    try {
        const { videoId } = req.params;
        const { comment } = req.body;
        const user: UserModelType = req.user;
        const video = await Video.findById(videoId);
        if (!video) {
            throw errorMessageWithCode("video not found", 404);
        }
        video?.comments.push(
            new Comment({
                author: user.firstName,
                body: comment,
                createdAt: getNow(),
            })
        );
        await video.save();
        res.status(201).json({ video });
    } catch (error) {
        next(error);
    }
};

commentsRouter
    .route("/video-lib/api/video/comment/:videoId")
    .post(verifyAuth, addCommentToVideo);
