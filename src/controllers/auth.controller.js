import mongoose from "mongoose";
import { UserModel } from "../models/user.model";
import jwt from "jsonwebtoken";
import { tokenBlackListModel } from "../models/tokenBlacklist.model";


export const userLoginController = async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password){
    res.status(400).json({message:"All fields are required"})
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(400).json({ message: "User does not exist signUp" });
  }

  const isPassCorrect = await user.checkPassword(password);
  if (!isPassCorrect) {
    res.status(400).json({ message: "Pass is Incorrect" });
  }

  const token = jwt.sign({ userId: _id }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });
  res.cookie("token", token);
  res.status(201).json({
    message: "User successfully registered",
    user: { _id: newUser._id, email: newUser.email, name: newUser.username },
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

  const user =await UserModel.findOne({ $or: [{ email: email }, { username }] });
  if (user) {
    res.status(400).json({ message: "User with this email exists" });
  }
  const hash=await bcrypt.hash(password, 10);
  const newUser = await new UserModel({ username, email, password:hash });
  newUser.save();
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

export const userLogoutController = async(req, res) =>{
  const token = req.cookies.token;
  const checkToken = await tokenBlackListModel.findOne({token})
  if(checkToken){
    res.status(400).json({message: "token does not exists"})
  }
  new Black = await new tokenBlackListModel({token});
  Black.save();

  const clearCookie = res.clearCookie("token");
  res.status(200).json({message:"User successfully LoggedOut"})
}