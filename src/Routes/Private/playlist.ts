import { Handler, Router } from "express";
import { verifyAuth } from "../../Middlewares/verifyAuth";
import { Playlist } from "../../Models/Playlist";
import { UserModelType } from "../../Models/User";
import { Video } from "../../Models/Video";
import { errorMessageWithCode } from "../../Utils/errorMessageWithCode";

export const playlistRouter = Router();

const getAllPlaylists: Handler = async (req, res, next) => {
    try {
        const user: UserModelType = req.user;
        res.json({ playlists: user.playlists });
    } catch (error) {
        next(error);
    }
};

const addNewPlaylist: Handler = async (req, res, next) => {
    try {
        const { playlist } = req.body;
        const user: UserModelType = req.user;
        user.playlists.push(new Playlist(playlist));
        await user.save();
        res.status(201).json({ playlists: user.playlists });
    } catch (error) {
        next(error);
    }
};

const deletePlaylist: Handler = async (req, res, next) => {
    try {
        const { playlistId } = req.params;
        const user: UserModelType = req.user;
        const playlistIndex = user.playlists.findIndex(
            (playlist) => playlist._id?.toString() === playlistId
        );
        if (playlistIndex === -1) {
            throw errorMessageWithCode("playlist not found", 404);
        }
        user.playlists.splice(playlistIndex, 1);
        await user.save();
        res.json({
            playlists: user.playlists,
        });
    } catch (error) {
        next(error);
    }
};

const getSinglePlaylist: Handler = async (req, res, next) => {
    try {
        const { playlistId } = req.params;
        const user: UserModelType = req.user;
        const playlistIndex = user.playlists.findIndex(
            (playlist) => playlist._id?.toString() === playlistId
        );
        if (playlistIndex === -1) {
            throw errorMessageWithCode("playlist not found", 404);
        }
        res.json({ playlist: user.playlists[playlistIndex] });
    } catch (error) {
        next(error);
    }
};

const addVideotoPlaylist: Handler = async (req, res, next) => {
    try {
        const { playlistId } = req.params;
        const { video } = req.body;
        const user: UserModelType = req.user;
        const playlistIndex = user.playlists.findIndex(
            (playlist) => playlist._id?.toString() === playlistId
        );
        if (playlistIndex === -1) {
            throw errorMessageWithCode("playlist not found", 404);
        }
        const currentPlaylist = user.playlists[playlistIndex];
        const videoIndex = currentPlaylist.videos.findIndex(
            (playlistVideo) => playlistVideo._id?.toString() === video._id
        );
        if (videoIndex !== -1) {
            throw errorMessageWithCode("video already exists", 400);
        }
        currentPlaylist.videos.push(new Video(video));
        await user.save();
        res.status(201).json({ playlist: currentPlaylist });
    } catch (error) {
        next(error);
    }
};

const deleteVideoFromPlaylist: Handler = async (req, res, next) => {
    try {
        const { playlistId, videoId } = req.params;
        const user: UserModelType = req.user;
        const playlistIndex = user.playlists.findIndex(
            (playlist) => playlist._id?.toString() === playlistId
        );
        if (playlistIndex === -1) {
            throw errorMessageWithCode("playlist not found", 404);
        }
        const currentPlaylist = user.playlists[playlistIndex];
        const videoIndex = currentPlaylist.videos.findIndex(
            (video) => video._id?.toString() === videoId
        );
        if (videoIndex === -1) {
            throw errorMessageWithCode("video not found", 404);
        }
        currentPlaylist.videos.splice(videoIndex, 1);
        await user.save();
        res.json({ playlist: currentPlaylist });
    } catch (error) {
        next(error);
    }
};

playlistRouter
    .route("/video-lib/api/user/playlists")
    .get(verifyAuth, getAllPlaylists)
    .post(verifyAuth, addNewPlaylist);

playlistRouter
    .route("/video-lib/api/user/playlists/:playlistId")
    .delete(verifyAuth, deletePlaylist)
    .get(verifyAuth, getSinglePlaylist)
    .post(verifyAuth, addVideotoPlaylist);

playlistRouter
    .route("/video-lib/api/user/playlists/:playlistId/:videoId")
    .delete(verifyAuth, deleteVideoFromPlaylist);
