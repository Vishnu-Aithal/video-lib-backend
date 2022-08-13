import { Schema, model } from "mongoose";
import { VideoSchema } from "./Video";

export const PlaylistSchema = new Schema({
    title: String,
    videos: [VideoSchema],
});

export const Playlist = model("Playlist", PlaylistSchema);
