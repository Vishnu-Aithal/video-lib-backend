import { Handler, Router } from "express";
import { nextTick } from "process";
import { verifyAuth } from "../../Middlewares/verifyAuth";
import { User, UserModelType } from "../../Models/User";
import { Video } from "../../Models/Video";
import { errorMessageWithCode } from "../../Utils/errorMessageWithCode";

export const likesRouter = Router();

const getLikedVideos: Handler = async (req, res, next) => {
    try {
        const user: UserModelType = req.user;
        res.json({ likes: user?.likes });
    } catch (error) {
        next(error);
    }
};
const addVideotoLikes: Handler = async (req, res, next) => {
    try {
        const { video } = req.body;
        const user: UserModelType = req.user;
        const videoIndex = user.likes.findIndex(
            (likedVideo) => likedVideo._id?.toString() === video._id
        );
        if (videoIndex !== -1) {
            throw errorMessageWithCode("video already exists", 400);
        }
        user?.likes.push(new Video(video));
        await user?.save();
        res.status(201).json({ likes: user?.likes });
    } catch (error) {
        next(error);
    }
};
const deleteVideoFromLikes: Handler = async (req, res, next) => {
    try {
        const { videoId } = req.params;
        const user: UserModelType = req.user;

        const videoIndex = user?.likes.findIndex(
            (video) => video._id?.toString() === videoId
        );
        if (videoIndex === -1) {
            throw errorMessageWithCode("video not found", 404);
        }
        user?.likes.splice(videoIndex, 1);
        await user.save();
        res.json({ likes: user?.likes });
    } catch (error) {
        next(error);
    }
};

likesRouter
    .route("/video-lib/api/user/likes")
    .get(verifyAuth, getLikedVideos)
    .post(verifyAuth, addVideotoLikes);

likesRouter
    .route("/video-lib/api/user/likes/:videoId")
    .delete(verifyAuth, deleteVideoFromLikes);
