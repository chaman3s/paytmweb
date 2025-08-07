const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Account= require('../models/Account');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const { JWT_SECRET,dataApiKey,dataApiUrl,database,Source} = require("../config/var");
const authMiddleware = require('../middleware/index');
const mongoose = require('mongoose');
const {makeConnections} = require("../utils/index")

// const db = require('@repo/db/client'); 



const usersnmeobj= zod.object({
    username:zod.string()
})

router.post('/Checkusername', async (req, res) =>{
    if(!req.body){return res.status(411).send({message:"pls send vaild data"});}
    const {success} =usersnmeobj.safeParse(req.body);
    if(!success){
       return  res.status(411).send({ message:"invaid input"}); 
    }
    const {username} = req.body;

    const existingUsername = await User.findOne({ username: username });
      if(existingUsername){
        return  res.status(400).send({ message:"username already  exists"});

      }
      else{
        return res.status(200).send({ message:"username not exists"});
      }
});



// Schema validation with detailed messages
const signupSchema = zod.object({
    username: zod.string()
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username must be at most 20 characters long"),

    firstname: zod.string()
        .min(2, "First name must be at least 2 characters long")
        .max(50, "First name cannot exceed 50 characters"),

    lastname: zod.string()
        .min(2, "Last name must be at least 2 characters long")
        .max(50, "Last name cannot exceed 50 characters"),

    password: zod.string()
        .min(6, "Password must be at least 6 characters long")
        .max(50, "Password cannot exceed 50 characters"),

    mobileno: zod.string()
        .length(10, "Mobile number must be exactly 10 digits")
        .regex(/^\d{10}$/, "Mobile number must contain only digits"),

   
});

router.post("/signup", async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is missing" });
    }

    // Validate input using Zod
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: validation.error.format()
        });
    }

    try {
        const { username, firstname, lastname, password, mobileno, location } = validation.data;

        // Ensure mobileno is not null or undefined
        if (!mobileno) {
            return res.status(400).json({ message: "Mobile number is required" });
        }

        // Check for existing users
        const existingUser = await User.findOne({
            $or: [{ username }, { mobileNo: { $ne: null, $eq: mobileno } }]
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(409).json({ exists: true, message: "Username is already taken" });
            }
            if (existingUser.mobileNo === mobileno) {
                return res.status(409).json({ exists: false, mobileInUse: true, message: "Mobile number already registered with another user" });
            }
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(password, salt);

        // Create new user
        
        const newUser = new User({
            logo: firstname[0].toUpperCase(),
            fullname: `${firstname} ${lastname}`,
            username:username,
            mobileNo:mobileno,
            password: securePass,
            upId: `${mobileno}@upi`,
            bankname: "dummy bank",
            location: location || "Not Provided",
        });

        await newUser.save();
        return res.status(201).json({ message: "Signup successful", user: { username, mobileno, fullname: newUser.fullname } });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});




const signinBody = zod.object({
    username: zod.string(),
    password: zod.string()
});

router.post("/signin", async (req, res) => {
    const validation = signinBody.safeParse(req.body);
    if (!validation.success) {
        return res.status(411).json({ message: "Incorrect inputs" });
    }

    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const pwdCompare = await bcrypt.compare(password, existingUser.password);
        if (!pwdCompare) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const userId = existingUser._id;
        let existingAccount = await Account.findOne({ userId });

        if (!existingAccount) {
            const initialBalance = 100;

            const entry = {
                currentBalance: initialBalance,
                transactionType: "Credit",
                amount: initialBalance,
                paymentMode: "wallet",
                status: "success",
                description: "Cashback from platform",
                valueDate: new Date(),
                postData: new Date(),
                currency: "INR"
            };

            existingAccount = new Account({
                userId,
                username: existingUser.username,
                mobileNo: existingUser.mobileNo,
                upid: existingUser.upId,
                bankname: existingUser.bankname || "",
                lockbalance: 0,
                entries: [entry],
                account: Date.now().toString(),
                balance: initialBalance
            });

            await existingAccount.save();
        }

        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

        const referralCodeOfUser = req.session.referralCode;
        if (referralCodeOfUser) {
            delete req.session.referralCode;
            if (await makeConnections(referralCodeOfUser, userId, res)) {
                return res.status(200).json({
                    message: "User successfully made connection via referral",
                });
            }
        }

        return res.status(200).json({
            message: "User successfully logged in",
            number: existingUser.mobileNo,
            token
        });

    } catch (err) {
        console.error("Signin Error:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
});
module.exports = router;