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
// const db = require('@repo/db/client'); 
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
router.post('/PayWebUserAuth', async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ message: 'Phone number and password are required.' });
    }

    try {
        const existingUser = await db.user.findFirst({ where: { number: phone } });

        if (existingUser) {
            // Compare passwords
            const passwordValidation = await bcrypt.compare(password, existingUser.password);

            if (passwordValidation) {
                const token = generateToken(existingUser);
                return res.status(200).json({
                    id: existingUser.id,
                    name: existingUser.name,
                    email: existingUser.number,
                    token
                });
            } else {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }
        }

        // If user doesn't exist, create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.user.create({
            data: {
                number: phone,
                password: hashedPassword
            }
        });

        const token = generateToken(newUser);

        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.number,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
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
        const { username, firstname, lastname, password, email } = req.body;

        const existingUser = await apiPostRequest('findOne', {
            dataSource: Source,
            database: "paytmweb",
            collection: "User",
            filter:  {$or: [
                { email: email },
                { username: username }
            ]}
        });

        if (existingUser.document) {
            return res.status(400).send({ message: "Email  or Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(password, salt);

        // Insert the new user and get the _id
        const userResult = await apiPostRequest('insertOne', {
            dataSource: Source,
            database: "paytmweb",
            collection: "User",
            document: {
                firstname,
                lastname,
                username,
                password: securePass,
                email,
            }
        });

        const userId = userResult.insertedId;  // Get the _id of the newly inserted user

        // Now insert into Account collection with the new userId
       

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
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }

    const { username, password } = req.body;

    // Check if user exists
    const existingUser = await apiPostRequest('findOne', {
        dataSource: Source, 
        database: "paytmweb", 
        collection: "User", 
        filter: { username: username }
    });

    if (!existingUser.document) {
        return res.status(411).send({ message: "Username and password are invalid" });
    }

    // Verify password
    const pwdCompare = await bcrypt.compare(password, existingUser.document.password);
    if (!pwdCompare) {
        return res.status(411).json({ message: "Username and password are invalid" });
    }

    // Check if account exists
    const userId = existingUser.document._id;
    const existingAccount = await apiPostRequest('findOne', {
        dataSource: Source,
        database: "paytmweb",
        collection: "Account",
        filter: { userId: userId }
    });

    // If the account doesn't exist, create it with an initial balance
    if (!existingAccount.document) {
        await apiPostRequest('insertOne', {
            dataSource: Source,
            database: "paytmweb",
            collection: "Account",
            document: {
                userId: userId,
                balance: 100 // Initial balance
            }
        });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: userId }, JWT_SECRET);

    return res.status(200).json({
        message: "User successfully logged in",
        token: token
    });
});


const updateBody = zod.object({
	password: zod.string().optional(),
    newPassword: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    email: zod.string().email().optional(),
});

// router.put("/userdata", authMiddleware, async (req, res) => {
//     const { success } = updateBody.safeParse(req.body);

//     if (!success) {
//         return res.status(411).json({
//             message: "Error while updating information"
//         });
//     }

//     try {
//         console.log("Raw User ID:", req.userId);
//         const userId = req.userId; 

//         const {updateFieldobj} = req.body; // T
//         // Validate the userId to ensure it's a valid ObjectId string
//         // if (!m.isValid(req.userId)) {
//         //     return res.status(400).json({ message: "Invalid User ID format" });
//         // }
        
//         // Use createFromHexString for proper conversion
//         const validObjectId = new mongoose.Types.ObjectId(userId);
//     //     console.log("Validated ObjectId:", validObjectId.toString());
//     //      const findUserData = await apiPostRequest('findOne', {
//     //         dataSource: Source,
//     //         database: "paytmweb",
//     //         collection: "User",
//     //         filter: { _id:{
//     //             "$oid":validObjectId.toString()}},
//     //          // Pass the validated ObjectI
//     //     }
//     // );


//     // if (!findUserData.document) {
//     //   return res.status(404).json({ message: "User not found" });
//     // }

//     // const user = findUserData.document;


//         // Perform the update query with the valid ObjectId
//         // if (password && newPassword) {
//         //     const isMatch = await bcrypt.compare(password, user.password);
//         //     if (!isMatch) {
//         //       return res.status(400).json({ message: "Old password is incorrect" });
//         //     }
      
//         //     // Hash the new password and add it to update fields
//         //     const hashedPassword = await bcrypt.hash(newPassword, 10);
//         //     updateFields.password = hashedPassword;
//         //   }
//         // }
//         const existingUser = await apiPostRequest('updateOne', {
//             dataSource: Source,
//             database: "paytmweb",
//             collection: "User",
//             filter: { _id:{
//                 "$oid":validObjectId.toString()}},
//              // Pass the validated ObjectId
//              update: { $set: updateFieldobj },
//         }
//     );

//         console.log("Update response:", existingUser);

//         // if (existingUser.matchedCount === 0) {
//         //     return res.status(404).json({ message: "User not found" });
//         // }

//         return res.status(200).json({
//             message: "Updated successfully"
//         });

//     } catch (error) {
//         console.error("Error during user update:", error);
//         return res.status(500).json({
//             message: "Internal Server Error"
//         });
//     }
// });
router.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
  });
  
  router.post('/api/users', async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  });
  
  router.delete('/api/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
  });
  
  
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
    console.log("filter: ", filter);

    const existingUsers = await apiPostRequest('find', {
        dataSource: Source, 
        database: "paytmweb", 
        collection: "User",
        filter: {
            username: { $regex: `^${filter}`, $options: "i" }  // Case-insensitive match
        }
    });
    
    console.log("existingUsers: ", existingUsers);
    
    // Check if documents are found
    if (!existingUsers.documents || existingUsers.documents.length === 0) {
        return res.status(411).send({ message: "No matching users found." });
    }

   

    res.status(200).json({
        user: existingUsers.documents.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})
module.exports = router;