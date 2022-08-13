import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
    categoryName: String,
    img: {
        src: String,
        alt: String,
    },
    description: String,
});

export const Category = model("Category", CategorySchema);
