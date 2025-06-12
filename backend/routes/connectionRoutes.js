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
router.get("/invite",authRefferalMiddleware,async(req, res)=>{
    const  referralCodeOfUser= req.session.referralCode;
    delete req.session.referralCode;
    if(makeConnections(referralCodeOfUser,req.userId,res)) res.status(200).json({ message:"successfully Connect" });
    // or /signup if that's your flow

    // or /signup if that's your flow
});
router.post("/getConnection",authMiddleware,async(req, res)=>{
       if (!req.userId) {
        return res.status(403).json({ message: "Unauthorized request, missing userId" });
    }

    try {
        let existReffer = await ConnectModel.findOne({ userId: req.userId });
        if (!existReffer) {
            // Generate a unique referral code
            const refferalCode = `REF-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

            existReffer = new ConnectModel({
                userId: req.userId,
                userRefferenceCode: refferalCode,
            });
            res.status(200).json({ message: "No connection found" });
        }
        else{
            
        }

}
catch(error){

}
})

module.exports = router;
