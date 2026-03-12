import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
    token:{
        type: String,
        required:[true, "Token is required to be blacklisted"]
    },
    
},{timestamps: true})

export const tokenBlackListModel = mongoose.model("tokenBlackList", tokenBlacklistSchema);