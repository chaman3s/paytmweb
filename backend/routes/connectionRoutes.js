const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const ConnectModel = require("../models/Connect");
const {authMiddleware,authRefferalMiddleware,} = require("../middleware/index");
const NodeCache = require("node-cache");
const User = require("../models/User");
const {makeConnections} = require("../utils/index")

const cache = new NodeCache({ stdTTL: 300, checkperiod: 600 }); // Cache for 5 minutes

// 🚀 Apply Rate Limiting to Prevent DoS Attacks
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Allow only 5 requests per minute per IP
    message: { message: "Too many requests, please try again later." },
    headers: true,
});
// Redirect to login or signup page as requ
router.get('/getRefferlink', authMiddleware, async (req, res) => {
    if (!req.userId) {
        return res.status(403).json({ message: "Unauthorized request, missing userId" });
    }

    try {
        // 🔹 Check if the referral link is already in cache
        const cachedLink = cache.get(req.userId);
        if (cachedLink) {
            return res.json({ link: cachedLink });
        }

        let existReffer = await ConnectModel.findOne({ userId: req.userId });

        if (!existReffer) {
            // Generate a unique referral code
            const refferalCode = `REF-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

            existReffer = new ConnectModel({
                userId: req.userId,
                userRefferenceCode: refferalCode,
            });

            await existReffer.save();
            referralLink = `http://localhost:3000/friends/invite/?ref=${refferalCode}`;
        }else{

         referralLink = `http://localhost:3000/friends/invite/?ref=${existReffer.userRefferenceCode}`;
        }
        // 🔹 Store in cache to reduce DB hits
        cache.set(req.userId, referralLink);

        res.status(200).json({ link: referralLink });
    } catch (error) {
        console.error("Error generating referral link:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
router.get("/invite", authRefferalMiddleware, async (req, res) => {
    try {
        const referralCodeOfUser = req.session.referralCode;
        console.log("userRe:", referralCodeOfUser);
        delete req.session.referralCode;

        // ✅ Await the result and DO NOT pass res
        const result = await makeConnections(referralCodeOfUser, req.userId);

        return res.status(result.status).json({ message: result.message });
    } catch (err) {
        console.error("Route error:", err);
        return res.status(500).json({ message: "Something went wrong" });
    }
});
router.post("/getConnection", authMiddleware, async (req, res) => {
    console.log("ok1");
    if (!req.userId) {
        return res.status(403).json({ message: "Unauthorized request, missing userId" });
    }

    console.log("ok2");
    try {
        const existReffer = await ConnectModel.findOne({ userId: req.userId });
        console.log("ok3");

        if (!existReffer) {
            console.log("ok4");
            const refferalCode = `REF-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
            const newConnection = new ConnectModel({
                userId: req.userId,
                userRefferenceCode: refferalCode,
                Connection: []
            });
            await newConnection.save();
            return res.status(200).json({ message: "No connection found" });
        }

        console.log("ok5");
        if (!existReffer.Connection || existReffer.Connection.length === 0) {
            console.log("ok6");
            return res.status(200).json({ message: "No connection found" });
        }

        console.log("ok7");
        const referralCodes = existReffer.Connection;
        console.log("ok8:", referralCodes);

        // Step 1: Find friends' userIds from ConnectModel
        const friendConnections = await ConnectModel.find({
            userRefferenceCode: { $in: referralCodes }
        }).select('userId');

        const friendUserIds = friendConnections.map(fc => fc.userId);
        console.log("Friend UserIds:", friendUserIds);

        if (friendUserIds.length === 0) {
            return res.status(200).json({ message: "No user data found for connections" });
        }

        // Step 2: Fetch user details using userIds
        const friends = await User.find({
            _id: { $in: friendUserIds }
        }).select('logo username fullname upId mobileNo');

        console.log("ok9:", friends);
        return res.status(200).json(friends);

    } catch (error) {
        console.error("Error fetching connections:", error);
        return res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
