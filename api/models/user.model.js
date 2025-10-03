import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
    trim: true,
  },
  resetOtp: {
    type: String,
    trim: true,
  },
  resetOtpExpiry: {
    type: Date,
    trim: true
  },
});

const User = mongoose.model("User", userSchema, "users");
export default User;

