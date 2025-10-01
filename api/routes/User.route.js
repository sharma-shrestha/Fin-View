import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { getMe } from "../controllers/User.controller.js";

const UserRoute = express.Router();

UserRoute.get("/me", authenticate, getMe);

export default UserRoute;