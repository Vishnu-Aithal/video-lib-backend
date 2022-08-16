import { Router, Handler } from "express";
import { Video } from "../../Models/Video";

export const videosRouter = Router();

const getAllVideos: Handler = async (req, res) => {
    try {
        const videos = await Video.find();
        res.json({ videos });
    } catch (err) {
        res.sendStatus(500);
    }
};
const getSingleVideo: Handler = async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId);

        res.json({ video });
    } catch (error) {
        res.sendStatus(500);
    }
};

videosRouter.route("/video-lib/api/videos").get(getAllVideos);
videosRouter.route("/video-lib/api/videos/:videoId").get(getSingleVideo);
