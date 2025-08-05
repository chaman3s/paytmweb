const express = require('express');
const {authMiddleware}  = require('../middleware/index');
const Account= require("../models/Account");
const mongoose = require('mongoose');
const axios = require('axios');
const router = express.Router();

router.get("/balance",authMiddleware, async (req, res) => {
    const userId = req.userId;
    const existaccount = await Account.findOne({ userId: userId });
    
    console.log("existaccount: ", existaccount);
    
    // Check if documents are found
    if (!existaccount) {
        return res.status(411).send({ message: "No matching account found." });
    }

    res.status(200).json({
        balance: existaccount.balance,
        lockbalance: existaccount.lockbalance
    })
});

router.post("/getTransactions", authMiddleware, async (req, res) => {
    if (!req.userId) {
        return res.status(403).json({ message: "Unauthorized request, missing userId" });
    }

    const existaccount = await Account.findOne({ userId: req.userId });

    if (!existaccount) {
        return res.status(404).json({ message: "No matching account found." });
    }

    res.status(200).json({
        transactions: existaccount.entries, // Corrected key name
    });
});
router.post('/getBankAccountNumber' ,authMiddleware, async (req, res) => {
    if (!req.userId) {
        return res.status(403).json({ message: "Unauthorized request, missing userId" });
    }

    const existaccount = await Account.findOne({ userId: req.userId });

    if (!existaccount) {
        return res.status(404).json({ message: "No matching account found." });
    }
    res.status(200).json({
        accountNumber: existaccount.account, // Corrected key name
    });
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { amount, to } = req.body;
        const userId = req.userId;
        if (!amount || !to) {
            return res.status(400).json({ message: "Amount and recipient ID are required" });
        }
        // Fetch sender account
        const senderAccount = await Account.findOne({ userId: userId }).session(session);
        if (!senderAccount || senderAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }
        // Fetch recipient account
        const recipientAccount = await Account.findOne({ userId: to }).session(session);
        if (!recipientAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Recipient account not found" });
        }
        // Deduct from sender
        const decrementResponse = await Account.updateOne(
            { userId: userId },
            { $inc: { balance: -amount } },
            { session }
        );
        if (!decrementResponse.modifiedCount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Failed to deduct balance from sender." });
        }
        // Add to recipient
        const incrementResponse = await Account.updateOne(
            { userId: to },
            { $inc: { balance: amount } },
            { session }
        );
        if (!incrementResponse.modifiedCount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Failed to credit recipient." });
        }
        // Commit
        await session.commitTransaction();
        res.status(200).json({ message: "Transaction successful." });
    } catch (error) {
        await session.abortTransaction();
        console.error("Transaction error:", error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        session.endSession();
    }
});

 
//   router.post("/create-onramp-transaction", authMiddleware, async (req, res) => {
//     const { provider, amount } = req.body;
//     const user = req.user; // Extracted by authMiddleware

//     if (!user || !user.id) {
//         return res.status(401).json({
//             message: "Unauthenticated request",
//         });
//     }

//     const token = (Math.random() * 1000).toString();

//     try {
//         await prisma.onRampTransaction.create({
//             data: {
//                 provider,
//                 status: "Processing",
//                 startTime: new Date(),
//                 token: token,
//                 userId: Number(user.id),
//                 amount: amount * 100,
//             },
//         });

//         res.status(200).json({ message: "Done" });
//     } catch (error) {
//         console.error("Error creating on-ramp transaction:", error);
//         res.status(500).json({
//             message: "Failed to create transaction",
//             error: error.message,
//         });
//     }
// });

// 
// router.post('/onramp', authenticateToken, async (req, res) => {
//     const { provider, amount } = req.body;

//     if (!provider || !amount) {
//         return res.status(400).json({ message: 'Provider and amount are required' });
//     }

//     try {
//         const token = (Math.random() * 1000).toString(); // Generate a mock token
//         const transaction = await prisma.onRampTransaction.create({
//             data: {
//                 provider,
//                 status: 'Processing',
//                 startTime: new Date(),
//                 token: token,
//                 userId: Number(req.user.id), // User ID from authenticated user
//                 amount: amount * 100 // Assuming the amount is in cents
//             }
//         });

//         res.status(201).json({
//             message: 'Transaction created successfully',
//             transaction
//         });
//     } catch (error) {
//         console.error('Error creating transaction:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });




module.exports = router;