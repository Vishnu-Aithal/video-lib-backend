import { Handler, Router } from "express";
import { verifyAuth } from "../../Middlewares/verifyAuth";
import { UserModelType } from "../../Models/User";
import { Video } from "../../Models/Video";
import { errorMessageWithCode } from "../../Utils/errorMessageWithCode";

export const historyRouter = Router();

const getVideosFromHistory: Handler = async (req, res, next) => {
    try {
        const user: UserModelType = req.user;
        res.json({ history: user?.history });
    } catch (error) {
        next(error);
    }
};

const addVideoToHistory: Handler = async (req, res, next) => {
    try {
        const { video } = req.body;
        const user: UserModelType = req.user;
        const videoIndex = user.history.findIndex(
            (historyVideo) => historyVideo._id?.toString() === video._id
        );
        if (videoIndex !== -1) {
            throw errorMessageWithCode("video already exists", 400);
        }
        user.history.push(new Video(video));
        await user.save();
        res.status(201).json({ history: user.history });
    } catch (error) {
        next(error);
    }
};

const deleteVideoFromHistory: Handler = async (req, res, next) => {
    try {
        const { videoId } = req.params;
        const user: UserModelType = req.user;
        const videoIndex = user.history.findIndex(
            (video) => video._id?.toString() === videoId
        );
        if (videoIndex === -1) {
            throw errorMessageWithCode("video not found", 404);
        }
        user.history.splice(videoIndex, 1);
        await user.save();
        res.json({ history: user.history });
    } catch (error) {
        next(error);
    }
};

historyRouter
    .route("/video-lib/api/user/history")
    .get(verifyAuth, getVideosFromHistory)
    .post(verifyAuth, addVideoToHistory);

historyRouter
    .route("/video-lib/api/user/history/:videoId")
    .delete(verifyAuth, deleteVideoFromHistory);
