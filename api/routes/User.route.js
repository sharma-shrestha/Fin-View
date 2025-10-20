import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { getMe, updateUser } from "../controllers/User.controller.js";

const UserRoute = express.Router();

UserRoute.get("/me", authenticate, getMe);
UserRoute.patch("/update", authenticate, updateUser);

export default UserRoute;