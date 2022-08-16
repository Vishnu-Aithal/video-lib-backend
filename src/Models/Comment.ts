import { model, Schema } from "mongoose";

export const CommentSchema = new Schema({
    author: String,
    body: String,
    createdAt: String,
});

export const Comment = model("Comment", CommentSchema);
