import express from 'express'
import jwt from 'jsonwebtoken';


export const authMiddlewear = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    const isMatch = await jwt.verify(token, process.env.JWT_SECRET);
    if (!isMatch) {
      return res.status(400).json({ message: "Token does not exists" });
    }
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Credentials" });
  }
};

