const express = require('express');
const router = express.Router();
const User = require('../models/User');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config/var");
const authMiddleware = require('../middleware/index');

const signupObj = zod.object({  
    username:zod.string(),
    fristname: zod.string(),
    Lastname: zod.string(),
    password: zod.string(),
    email : zod.string().email(),
});
router.post('/signup', async (req, res) =>{
    const body = req.body;
    const {success} =signupObj.safeParse(req.body);
    if(!success){
       return  res.status(411).send({ message:"invaid input"}); 
    }
    const user = User.findOne(body.email);
    if(user){
      return  res.status(400).send({ message:"email already  exists"});
    }
    const dbuser = await User.create(body);
    const token = jwt.sign({userId:dbuser._id},JWT_SECRET);
    res.status(200).send({message:"user successfully created", token:token});
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

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})
module.exports = router;