const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const ConnectModel = require("../models/Connect");
const {authMiddleware,authRefferalMiddleware,} = require("../middleware/index");
const NodeCache = require("node-cache");
const User = require("../models/User");
async function  makeConnections(referralCodeOfUser, userId,res) {
    try {
       // e.g., /invite?ref=REF-123456
       
   
       // Clear referral code from session after use
       
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
               Connection:[referralCodeOfUser]
           });
           await existReffer.save();
       } else if(referralCodeOfUser != existReffer.userRefferenceCode){
           await ConnectModel.updateOne({ userId: userId }, { $set: { Connection: existReffer.Connection.push(referralCodeOfUser) } });
       }
       else{
           return res.status(400).json({ message: "some thing wrong" });
       }

       let existRefferToUser = await ConnectModel.findOne({userRefferenceCode: referralCodeOfUser });
       await ConnectModel.updateOne({userRefferenceCode: referralCodeOfUser }, { $set: { Connection: existRefferToUser.Connection.push(existReffer.userRefferenceCode)} });
       return true;
    }
    catch (error) {
       console.error("Error inviting friend:", error);
       res.status(500).json({ message: "Internal Server Error" });
    }
}
module.exports ={makeConnections}