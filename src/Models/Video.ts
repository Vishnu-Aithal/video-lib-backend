import { Schema, model } from "mongoose";

export const VideoSchema = new Schema({
    title: String,
    description: String,
    creator: String,
    img: { src: String, alt: String },
    url: String,
});

export const Video = model("Video", VideoSchema);
