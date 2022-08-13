import { Router, Handler } from "express";
import { Category } from "../../Models/Category";
import { Video } from "../../Models/Video";

export const categoriesRouter = Router();

const getAllCategories: Handler = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({ categories });
    } catch (error) {
        res.sendStatus(500);
    }
};

categoriesRouter.route("/api/categories").get(getAllCategories);
