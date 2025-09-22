import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { handleError } from "../helpers/handleError.js";
// Utility to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// --------------------- REGISTER ---------------------
export const Register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(handleError(409, "User already registered"));
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await user.save();

    const token = generateToken(user);

    const userData = user.toObject({ getters: true });
    delete userData.password;

    res.status(201).json({
      success: true,
      user: userData,
      token,
      message: "Registration successful",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// --------------------- LOGIN ---------------------
export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next(handleError(404, "Invalid login credential"));

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return next(handleError(401, "Invalid login credential"));

    const token = generateToken(user);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userData = user.toObject({ getters: true });
    delete userData.password;

    res.status(200).json({
      success: true,
      user: userData,
      token,
      message: "Login successful",
    });
  } catch (err) {
    next(handleError(500, err.message));
  }
};

// --------------------- GOOGLE LOGIN ---------------------
export const GoogleLogin = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(randomPassword, 10);

      user = await new User({
        name,
        email,
        password: hashedPassword,
        avatar,
      }).save();
    }

    const token = generateToken(user);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userData = user.toObject({ getters: true });
    delete userData.password;

    res.status(200).json({
      success: true,
      user: userData,
      token,
      message: "Google login successful",
    });
  } catch (err) {
    next(handleError(500, err.message));
  }
};
