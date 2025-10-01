import bcryptjs from "bcryptjs";
import { handleError } from "../helpers/handleError.js";
import User from "../models/user.model.js";

export const getMe = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) return next(handleError(401, "Unauthorized"));

    const user = await User.findById(userId).select("name").lean().exec();
    if (!user) return next(handleError(404, "User not found."));

    res.status(200).json({ success: true, message: "Current user data", user });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
