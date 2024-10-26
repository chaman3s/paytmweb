const express = require('express');
const authMiddleware  = require('../middleware/index');
const { Account } = require("../models/Account");
const mongoose  = require('mongoose');

const router = express.Router();

router.get("/balance",authMiddleware, async (req, res) => {
    const existaccount = await apiPostRequest('findOne', {
        dataSource: Source, 
        database: "paytmweb", 
        collection: "Account",
        filter: {insertedId:req.userId}
            
    });
    
    console.log("existaccount: ", existaccount);
    
    // Check if documents are found
    if (!existaccount.documents || existaccount.documents.length === 0) {
        return res.status(411).send({ message: "No matching account found." });
    }

    res.status(200).json({
        balance: existaccount.balance
    })
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;
    const userId = req.userId;
    const validObjectId = new mongoose.Types.ObjectId(userId);
    const existingUser = await apiPostRequest('findOne', {
        dataSource: Source,
        database: "paytmweb",
        collection: "User",
        filter: { _id:{
            "$oid":validObjectId.toString()}},
    }
);
if (!existingUser.documents || existingUser.documents.length === 0|| existingUser.balance < amount) {
    return res.status(400).send({ message:"Insufficient balance" });
}
    // Fetch the accounts within the transaction
    validObjectId = new mongoose.Types.ObjectId(to);
    const toexistaccount = await apiPostRequest('findOne', {
        dataSource: Source, 
        database: "paytmweb", 
        collection: "Account",
       filter: { _id:{
        "$oid":validObjectId.toString()}},
    }).session(session);
    
    console.log("existaccount: ", existingUser);
    
    // Check if documents are foun
    
    console.log("existaccount: ", toexistaccount);
    
    // Check if documents are found
    if (!toexistaccount.documents || toexistaccount.documents.length === 0) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }
    

    // Perform the transfer
    const decrementResponse = await apiPostRequest('updateOne', {
        dataSource: Source,
        database: "paytmweb",
        collection: "Account",
        filter: { userId: req.userId },
        update: { $inc: { balance: -amount } }
    });
    
    if (!decrementResponse.modifiedCount) {
        // Rollback or handle error if deduction failed
        return res.status(400).send({ message: "Failed to deduct balance from sender." });
    }
    
    // Add the amount to the recipient's account
    const incrementResponse = await apiPostRequest('updateOne', {
        dataSource: Source,
        database: "paytmweb",
        collection: "Account",
        filter: { userId: to },
        update: { $inc: { balance: amount } }
    });
    
    if (!incrementResponse.modifiedCount) {
        // Rollback the initial deduction if increment fails
        await apiPostRequest('updateOne', {
            dataSource: Source,
            database: "paytmweb",
            collection: "Account",
            filter: { userId: req.userId },
            update: { $inc: { balance: amount } }
        });
        
        return res.status(400).send({ message: "Failed to add balance to recipient. Transaction rolled back." });
    }
    
    // If both updates succeed, transaction-like flow is complete
    await session.commitTransaction();
    res.status(200).send({ message: "Transaction successful." });
    
});

module.exports = router;