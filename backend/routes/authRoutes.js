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

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Verify password
        const pwdCompare = await bcrypt.compare(password, existingUser.password);
        if (!pwdCompare) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Check if account exists
        const userId = existingUser._id;
        let existingAccount = await Account.findOne({ userId });

        // If the account doesn't exist, create it with an initial balance
        if (!existingAccount) {
            const entries = [{
                transactionType: "Debit",
                amount: 100,
                paymentMode: "wallet",
                status: "success",
                description: "deposited cash to wallet",
                valueDate: new Date().toLocaleDateString('en-GB'),
                postData: new Date().toLocaleDateString('en-GB'),
                Currency: "INR"
            }];

            existingAccount = new Account({
                userId,
                username,
                mobileNo: existingUser.mobileNo, // Ensure mobile number exists in user
                upid: existingUser.upId,
                bankname: existingUser.bankname,
                entries,
                account: Date.now(),
                balance: 100
            });

            await existingAccount.save();
        }

        // Generate JWT token
        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
        const  referralCodeOfUser= req.session.referralCode;
        if(referralCodeOfUser){
        delete req.session.referralCode;
        if(makeConnections(referralCodeOfUser,userId,res)){
        return res.status(200).json({
            message: "User successfully logged in",
            token
        });}
    }
    } catch (err) {
        console.error("Signin Error:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
});
module.exports = router;


// const updateBody = zod.object({
// 	password: zod.string().optional(),
//     newPassword: zod.string().optional(),
//     firstName: zod.string().optional(),
//     lastName: zod.string().optional(),
//     email: zod.string().email().optional(),
// });

// // router.put("/userdata", authMiddleware, async (req, res) => {
// //     const { success } = updateBody.safeParse(req.body);

// //     if (!success) {
// //         return res.status(411).json({
// //             message: "Error while updating information"
// //         });
// //     }

// //     try {
// //         console.log("Raw User ID:", req.userId);
// //         const userId = req.userId; 

// //         const {updateFieldobj} = req.body; // T
// //         // Validate the userId to ensure it's a valid ObjectId string
// //         // if (!m.isValid(req.userId)) {
// //         //     return res.status(400).json({ message: "Invalid User ID format" });
// //         // }
        
// //         // Use createFromHexString for proper conversion
// //         const validObjectId = new mongoose.Types.ObjectId(userId);
// //     //     console.log("Validated ObjectId:", validObjectId.toString());
// //     //      const findUserData = await apiPostRequest('findOne', {
// //     //         dataSource: Source,
// //     //         database: "paytmweb",
// //     //         collection: "User",
// //     //         filter: { _id:{
// //     //             "$oid":validObjectId.toString()}},
// //     //          // Pass the validated ObjectI
// //     //     }
// //     // );


// //     // if (!findUserData.document) {
// //     //   return res.status(404).json({ message: "User not found" });
// //     // }

// //     // const user = findUserData.document;


// //         // Perform the update query with the valid ObjectId
// //         // if (password && newPassword) {
// //         //     const isMatch = await bcrypt.compare(password, user.password);
// //         //     if (!isMatch) {
// //         //       return res.status(400).json({ message: "Old password is incorrect" });
// //         //     }
      
// //         //     // Hash the new password and add it to update fields
// //         //     const hashedPassword = await bcrypt.hash(newPassword, 10);
// //         //     updateFields.password = hashedPassword;
// //         //   }
// //         // }
// //         const existingUser = await apiPostRequest('updateOne', {
// //             dataSource: Source,
// //             database: "paytmweb",
// //             collection: "User",
// //             filter: { _id:{
// //                 "$oid":validObjectId.toString()}},
// //              // Pass the validated ObjectId
// //              update: { $set: updateFieldobj },
// //         }
// //     );

// //         console.log("Update response:", existingUser);

// //         // if (existingUser.matchedCount === 0) {
// //         //     return res.status(404).json({ message: "User not found" });
// //         // }

// //         return res.status(200).json({
// //             message: "Updated successfully"
// //         });

// //     } catch (error) {
// //         console.error("Error during user update:", error);
// //         return res.status(500).json({
// //             message: "Internal Server Error"
// //         });
// //     }
// // });
// router.get('/api/users', async (req, res) => {
//     const users = await User.find();
//     res.json(users);
//   });
  
//   router.post('/api/users', async (req, res) => {
//     const newUser = new User(req.body);
//     await newUser.save();
//     res.status(201).json(newUser);
//   });
  
//   router.delete('/api/users/:id', async (req, res) => {
//     await User.findByIdAndDelete(req.params.id);
//     res.status(204).send();
//   });
  
  
// router.get("/bulk", async (req, res) => {
//     const filter = req.query.filter || "";
//     console.log("filter: ", filter);

//     const existingUsers = await apiPostRequest('find', {
//         dataSource: Source, 
//         database: "paytmweb", 
//         collection: "User",
//         filter: {
//             username: { $regex: `^${filter}`, $options: "i" }  // Case-insensitive match
//         }
//     });
    
//     console.log("existingUsers: ", existingUsers);
    
//     // Check if documents are found
//     if (!existingUsers.documents || existingUsers.documents.length === 0) {
//         return res.status(411).send({ message: "No matching users found." });
//     }

   

//     res.status(200).json({
//         user: existingUsers.documents.map(user => ({
//             username: user.username,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             _id: user._id
//         }))
//     })
// })
// module.exports = router;