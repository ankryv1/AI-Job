import mongoose from "mongoose";
import { UserModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { tokenBlackListModel } from "../models/tokenBlacklist.model.js";

export const userLoginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User does not exist signUp" });
  }

  const isPassCorrect = await user.checkPassword(password);
  if (!isPassCorrect) {
    return res.status(400).json({ message: "Pass is Incorrect" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });
  res.cookie("token", token);
  res.status(201).json({
    message: "User successfully registered",
    user: { _id: user._id, email: user.email, name: user.username },
    token,
  });
};

export const userSignupController = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: " provide username, email and password",
    });
  }

  const user = await UserModel.findOne({
    $or: [{ email: email }, { username }],
  });
  if (user) {
    return res.status(400).json({ message: "User with this email exists" });
  }
  const hash = await bcrypt.hash(password, 10);
  const newUser = await new UserModel({ username, email, password: hash });
  await newUser.save();
  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });
  res.cookie("token", token);
  res.status(201).json({
    message: "User successfully registered",
    user: { _id: newUser._id, email: newUser.email, name: newUser.username },
    token,
  });
};

export const userLogoutController = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({ message: "You are already logged out" });
    }

    const isAlreadyBlacklisted = await tokenBlackListModel.findOne({ token });

    if (!isAlreadyBlacklisted) {
      const blacklistedToken = new tokenBlackListModel({ token });
      await blacklistedToken.save();
    }

    res.clearCookie("token");
    return res.status(200).json({ message: "User successfully Logged Out" });
  } catch (error) {
    return res.status(500).json({ message: "Server error during logout" });
  }
};

export const getMeController = async(req, res) =>{

  if(!req.user){
    return res.status(404).json({message:"User not found"})
  }

  return res.status(200).json({message:"Successfully got the user", user:{
    _id:req.user._id,
    email:req.user.email,
    user:req.user.username
  }})
}
