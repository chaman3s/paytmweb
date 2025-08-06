const express = require('express');
const {authMiddleware}  = require('../middleware/index');
const Account= require("../models/Account");
const mongoose = require('mongoose');
const axios = require('axios');
const User = require('../models/User');
const { record } = require('zod');
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
        const { amount, to, paymentMode = "wallet", recipientDescription = "Receive Money" ,SenderDescription = "send Money"} = req.body;
        console.log("log:",res.body);
        const senderId = req.userId;
        if (!amount || !to) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Amount and recipient number are required" });
        }
        // Find sender's account
        const senderAccount = await Account.findOne({ userId: senderId }).session(session);
        if (!senderAccount || senderAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance or sender account not found" });
        }
        // Find recipient user by mobile number
        const recipientUser = await User.findOne({ mobileNo: to }).session(session);
        if (!recipientUser) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Recipient user not found" });
        }
        const recipientId = recipientUser._id;
        // Prevent self-transfer
        if (recipientId.toString() === senderId.toString()) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Cannot transfer to self." });
        }

        // Find recipient's account
        const recipientAccount = await Account.findOne({ userId: recipientId }).session(session);
        if (!recipientAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Recipient account not found" });
        }
        // Create transaction reference
        const referenceNo = Date.now().toString() + Math.floor(Math.random() * 10000).toString();
        // Deduct from sender
        const senderUpdate = await Account.updateOne(
            { userId: senderId },
            {
                $inc: { balance: -amount },
                $push: {
                    entries: {
                        transactionType: "Debit",
                        referenceNo,
                        amount,
                        paymentMode,
                        status: "success",
                        description:SenderDescription,
                    }
                }
            },
            { session }
        );
        //Credit to recipient
        const recipientUpdate = await Account.updateOne(
            { userId: recipientId },
            {
                $inc: { balance: amount },
                $push: {
                    entries: {
                        transactionType: "Credit",
                        referenceNo,
                        amount,
                        paymentMode,
                        status: "success",
                        description:recipientDescription,
                    }
                }
            },
            { session }
        );
        if (!senderUpdate.modifiedCount || !recipientUpdate.modifiedCount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Transaction failed. Could not update balances." });
        }
        await session.commitTransaction();
        res.status(200).json({ message: "Transaction successful", referenceNo });
    } catch (error) {
        console.error("Transfer error:", error);
        await session.abortTransaction();
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