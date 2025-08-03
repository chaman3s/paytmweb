const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const ConnectModel = require("../models/Connect");
const {authMiddleware,authRefferalMiddleware,} = require("../middleware/index");
const NodeCache = require("node-cache");
const User = require("../models/User");
async function makeConnections(referralCodeOfUser, userId) {
    try {
        if (!userId) {
            return { status: 403, message: "Unauthorized request, missing userId" };
        }

        let userConnection = await ConnectModel.findOne({ userId });

        if (!userConnection) {
            const newReferralCode = `REF-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
            userConnection = new ConnectModel({
                userId,
                userRefferenceCode: newReferralCode,
                Connection: referralCodeOfUser ? [referralCodeOfUser] : [],
            });
            await userConnection.save();
        } else {
            if (
                !referralCodeOfUser ||
                referralCodeOfUser === userConnection.userRefferenceCode ||
                userConnection.Connection.includes(referralCodeOfUser)
            ) {
                return { status: 400, message: "Invalid or duplicate referral" };
            }

            await ConnectModel.updateOne(
                { userId },
                { $addToSet: { Connection: referralCodeOfUser } }
            );
        }

        if (referralCodeOfUser) {
            const friend = await ConnectModel.findOne({ userRefferenceCode: referralCodeOfUser });
            if (friend) {
                await ConnectModel.updateOne(
                    { userRefferenceCode: referralCodeOfUser },
                    { $addToSet: { Connection: userConnection.userRefferenceCode } }
                );
            }
        }

        return { status: 200, message: "Referral processed successfully" };
    } catch (error) {
        console.error("Error inviting friend:", error);
        return { status: 500, message: "Internal Server Error" };
    }
}




module.exports ={makeConnections}