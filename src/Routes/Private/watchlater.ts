import { Handler, Router } from "express";
import { verifyAuth } from "../../Middlewares/verifyAuth";
import { UserModelType } from "../../Models/User";
import { Video } from "../../Models/Video";
import { errorMessageWithCode } from "../../Utils/errorMessageWithCode";

export const watchlaterRouter = Router();

const getWatchlaterVideos: Handler = async (req, res, next) => {
    try {
        const user: UserModelType = req.user;
        res.json({ watchlater: user?.watchlater });
    } catch (error) {
        next(error);
    }
};

const addVideotoWatchlater: Handler = async (req, res, next) => {
    try {
        const { video } = req.body;
        const user: UserModelType = req.user;
        const videoIndex = user.watchlater.findIndex(
            (watchlaterVideo) => watchlaterVideo._id?.toString() === video._id
        );
        if (videoIndex !== -1) {
            throw errorMessageWithCode("video already exists", 400);
        }
        user?.watchlater.push(new Video(video));
        await user?.save();
        res.status(201).json({ watchlater: user?.watchlater });
    } catch (error) {
        next(error);
    }
};
const deleteVideoFromWatchlater: Handler = async (req, res, next) => {
    try {
        const { videoId } = req.params;
        const user: UserModelType = req.user;
        const videoIndex = user?.watchlater.findIndex(
            (video) => video._id?.toString() === videoId
        );
        if (videoIndex === -1) {
            throw errorMessageWithCode("video not found", 404);
        }
        user?.watchlater.splice(videoIndex, 1);
        await user.save();
        res.json({ watchlater: user?.watchlater });
    } catch (error) {
        next(error);
    }
};

watchlaterRouter
    .route("/video-lib/api/user/watchlater")
    .get(verifyAuth, getWatchlaterVideos)
    .post(verifyAuth, addVideotoWatchlater);

watchlaterRouter
    .route("/video-lib/api/user/watchlater/:videoId")
    .delete(verifyAuth, deleteVideoFromWatchlater);
