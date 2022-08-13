import { Schema, model } from "mongoose";
import { PlaylistSchema } from "./Playlist";
import { VideoSchema } from "./Video";

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    createdAt: String,
    updatedAt: String,
    history: [VideoSchema],
    likes: [VideoSchema],
    playlists: [PlaylistSchema],
    watchlater: [VideoSchema],
});

export const User = model("User", UserSchema);
export type UserModelType = InstanceType<typeof User>;
