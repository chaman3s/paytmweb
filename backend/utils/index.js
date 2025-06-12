const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const ConnectModel = require("../models/Connect");
const {authMiddleware,authRefferalMiddleware,} = require("../middleware/index");
const NodeCache = require("node-cache");
const User = require("../models/User");
async function  makeConnections(referralCodeOfUser, userId,res) {
    try {
        if (!userId) {
            return res.status(403).json({ message: "Unauthorized request, missing userId" });
        }
    
        let existReffer = await ConnectModel.findOne({ userId: userId });
    
        if (!existReffer) {
            // Generate a unique referral code
            let refferalCode = `REF-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    
            existReffer = new ConnectModel({
                userId: userId,
                userRefferenceCode: refferalCode,
                Connection: referralCodeOfUser ? [referralCodeOfUser] : []
            });
            await existReffer.save();
        } else if (referralCodeOfUser && referralCodeOfUser !== existReffer.userRefferenceCode) {
            let arr =existReffer.Connection 
            arr.push (userRefferenceCode)
            await ConnectModel.updateOne(
                { userId: userId },
                { $addToSet: { Connection: arr } } // Ensures unique values
            );
        } else {
            return res.status(400).json({ message: "Something went wrong" });
        }
    
        let existRefferToUser = await ConnectModel.findOne({ userRefferenceCode: referralCodeOfUser });
        let arr= existRefferToUser.Connection
        arr.push(existReffer.userRefferenceCode)
        if (existRefferToUser) {
            await ConnectModel.updateOne(
                { userRefferenceCode: referralCodeOfUser },
                { $addToSet: { Connection: arr } } // Ensures uniqueness
            );
        }
    
        return res.status(200).json({ message: "Referral processed successfully" });
    } catch (error) {
        console.error("Error inviting friend:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
    
}
module.exports ={makeConnections}