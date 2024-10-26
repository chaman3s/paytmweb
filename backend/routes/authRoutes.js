const express = require('express');
const router = express.Router();
const User = require('../models/User');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const { JWT_SECRET,dataApiKey,dataApiUrl,database,Source} = require("../config/var");
const authMiddleware = require('../middleware/index');
const mongoose = require('mongoose');
const headers = {
    'Content-Type': 'application/json',
    'api-key': dataApiKey,
    'Accept': 'application/json'
  };

  async function apiPostRequest(action, body) {
    const response = await axios.post(`${dataApiUrl}/${action}`, body, { headers });
    return response.data;
  }
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
    const existingUsername = await apiPostRequest('findOne', {
        dataSource: Source, 
        database: "paytmweb", 
        collection: "User", 
        filter: {username:username}
      });
      if(existingUsername.document){
        return  res.status(400).send({ message:"username already  exists"});

      }
      else{
        return res.status(200).send({ message:"username not exists"});
      }
});

const signupObj = zod.object({  
    username:zod.string(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string(),
    email : zod.string().email(),
});
 router.post('/signup', async (req, res) => {
    if (!req.body) {
        return res.status(411).send({ message: "Please send valid data" });
    }

    const { success } = signupObj.safeParse(req.body);
    if (!success) {
        return res.status(411).send({ message: "Invalid input" });
    }

    try {
        const { username, fristname, lastname, password, email } = req.body;

        const existingUser = await apiPostRequest('findOne', {
            dataSource: Source,
            database: "paytmweb",
            collection: "User",
            filter: { email: email }
        });

        if (existingUser.document) {
            return res.status(400).send({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(password, salt);

        // Insert the new user and get the _id
        const userResult = await apiPostRequest('insertOne', {
            dataSource: Source,
            database: "paytmweb",
            collection: "User",
            document: {
                fristname,
                lastname,
                username,
                password: securePass,
                email,
            }
        });

        const userId = userResult.insertedId;  // Get the _id of the newly inserted user

        // Now insert into Account collection with the new userId
        const accountResult = await apiPostRequest('insertOne', {
            dataSource: Source,
            database: "paytmweb",
            collection: "Account",
            document: {
                userId: userId,
                balance: 100
            }
        });

        return res.status(201).send({ message: "User registered successfully", userId: userId });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal server error" });
    }
});

const signinBody = zod.object({
    username: zod.string(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: " Incorrect inputs"
        })
    }
    const {username,password} = req.body;

    const existingUser = await apiPostRequest('findOne', {
        dataSource: Source, 
        database: "paytmweb", 
        collection: "User", 
        filter: {username:username}
      });
      console.log("userex: ",existingUser._id);
    if(!existingUser.document){
      return  res.status(411).send({ message:"Username and password are invalid"});
    }
    const pwdCompare = await bcrypt.compare(password, existingUser.document.password);

    if (!pwdCompare) {
        return res.status(411).json({ message:"Username and password are invalid"});
    }
    
      
      console.log("exists: ",existingUser.document._id);
        const token = jwt.sign({
            userId: existingUser.document._id
        }, JWT_SECRET);
  
        return res.status(200).json({
            message: "users successfully login",
            token: token
        })
})

const updateBody = zod.object({
	password: zod.string(),
    newPassword: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    email: zod.string().email().optional(),
});

router.put("/userdata", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        });
    }

    try {
        console.log("Raw User ID:", req.userId);
        const userId = req.userId; 

        const {updateFieldobj} = req.body; // T
        // Validate the userId to ensure it's a valid ObjectId string
        // if (!m.isValid(req.userId)) {
        //     return res.status(400).json({ message: "Invalid User ID format" });
        // }
        
        // Use createFromHexString for proper conversion
        const validObjectId = new mongoose.Types.ObjectId(userId);
    //     console.log("Validated ObjectId:", validObjectId.toString());
    //      const findUserData = await apiPostRequest('findOne', {
    //         dataSource: Source,
    //         database: "paytmweb",
    //         collection: "User",
    //         filter: { _id:{
    //             "$oid":validObjectId.toString()}},
    //          // Pass the validated ObjectI
    //     }
    // );


    // if (!findUserData.document) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // const user = findUserData.document;


        // Perform the update query with the valid ObjectId
        // if (password && newPassword) {
        //     const isMatch = await bcrypt.compare(password, user.password);
        //     if (!isMatch) {
        //       return res.status(400).json({ message: "Old password is incorrect" });
        //     }
      
        //     // Hash the new password and add it to update fields
        //     const hashedPassword = await bcrypt.hash(newPassword, 10);
        //     updateFields.password = hashedPassword;
        //   }
        // }
        const existingUser = await apiPostRequest('updateOne', {
            dataSource: Source,
            database: "paytmweb",
            collection: "User",
            filter: { _id:{
                "$oid":validObjectId.toString()}},
             // Pass the validated ObjectId
             update: { $set: updateFieldobj },
        }
    );

        console.log("Update response:", existingUser);

        // if (existingUser.matchedCount === 0) {
        //     return res.status(404).json({ message: "User not found" });
        // }

        return res.status(200).json({
            message: "Updated successfully"
        });

    } catch (error) {
        console.error("Error during user update:", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
    const {username,password} = req.body;

    const existingUsers = await apiPostRequest('find', {
        dataSource: Source, 
        database: "paytmweb", 
        collection: "User",
        filter: {
            $or: [
                { firstName: { "$regex": filter } },
                { lastName: { "$regex": filter } }
            ]
        }
    });
    
    console.log("existingUsers: ", existingUsers);
    
    // Check if documents are found
    if (!existingUsers.documents || existingUsers.documents.length === 0) {
        return res.status(411).send({ message: "No matching users found." });
    }

   

    res.status(200).json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})
module.exports = router;