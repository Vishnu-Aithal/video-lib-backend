import { Schema, model } from "mongoose";
import { CommentSchema } from "./Comment";

export const VideoSchema = new Schema({
    title: String,
    description: String,
    creator: String,
    img: { src: String, alt: String },
    url: String,
    comments: [CommentSchema],
});

export const Video = model("Video", VideoSchema);
