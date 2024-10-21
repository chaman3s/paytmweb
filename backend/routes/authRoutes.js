const express = require('express');
const router = express.Router();
const User = require('../models/User');
const zod = require('zod');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signupObj = zod.object({  
    username:zod.string(),
    fristname: zod.string(),
    Lastname: zod.string(),
    password: zod.string(),
    email : zod.string(),
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
    const token = jwt.sign({userId:dbuser._id},process.env.Jwt_Secret);
    res.status(200).send({message:"user successfully created", token:token});
});
module.exports = router;