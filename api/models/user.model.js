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
  roomNumber: {
    type: String,
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
  altPhone: {
    type: String,
    trim: true
  },
  dob: {
    type: String,
    trim: true
  },
state: { 
    type: String,
    trim: true
},
city: {
    type: String,
    trim: true
},
emergencyContactName: {
    type: String,
    trim: true
},
emergencyContactNumber: {
    type: String,
    trim: true
},
  resetToken:{
    type: String, 
    trim: true
  },
  resetTokenExpiry: {
    type: Date,
    trim: true
  },
});

const User = mongoose.model("User", userSchema, "users");
export default User;

