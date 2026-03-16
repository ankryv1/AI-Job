import express from "express";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/user.model.js";
import { tokenBlackListModel } from "../models/tokenBlacklist.model.js";

export const authMiddlewear = async (req, res, next) => {

  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const blacklisted = await tokenBlackListModel.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: "Token expired. Login again." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
