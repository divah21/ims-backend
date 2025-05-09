import { Router } from "express";
import {
    registerUser,
    login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/user.controller.js";

const authRouter = Router();
authRouter.post("/register", registerUser);
authRouter.post("/login", login);
authRouter.get("/users", getAllUsers);
authRouter.get("/user/:id", getUserById);
authRouter.patch("/user/:id", updateUser);
authRouter.delete("/user/:id", deleteUser);

export default authRouter;
