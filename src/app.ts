import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import { likesRouter } from "./Routes/Private/likes";
import { authRouter } from "./Routes/Public/auth";
import { categoriesRouter } from "./Routes/Public/categories";

import { videosRouter } from "./Routes/Public/videos";
import { watchlaterRouter } from "./Routes/Private/watchlater";
import { historyRouter } from "./Routes/Private/history";
import { playlistRouter } from "./Routes/Private/playlist";
import { errorHandling } from "./Middlewares/errorHandling";

const JSONParser = express.json();
const app = express();

app.use(JSONParser);
app.use(helmet());
app.use(cors());

app.use(videosRouter);
app.use(categoriesRouter);
app.use(authRouter);
app.use(likesRouter);
app.use(watchlaterRouter);
app.use(historyRouter);
app.use(playlistRouter);

app.use(errorHandling);

app.get("/video-lib/", (req, res) => res.json({ backend: "video-lib" }));
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT || 3000);
    })

    .catch((err) => console.log(err));
