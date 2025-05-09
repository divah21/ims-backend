import { Router } from "express";
import upload from "../config/multer.config.js";
import {
    createNewsfeed,
    getAllNewsfeed,
    getNewsfeedById,
    updateNewsfeed,
    deleteNewsfeed,
} from "../controllers/newsfeed.controller.js";

const newsfeedRouter = Router();

newsfeedRouter.post("/", upload.single("image"), createNewsfeed);
newsfeedRouter.get("/", getAllNewsfeed);
newsfeedRouter.get("/:id", getNewsfeedById);
newsfeedRouter.patch("/:id", upload.single("image"), updateNewsfeed);
newsfeedRouter.delete("/:id", deleteNewsfeed);

export default newsfeedRouter;

