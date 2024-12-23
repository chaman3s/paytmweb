const express = require('express');
const authMiddleware  = require('../middleware/index');
const { Account } = require("../models/Account");
const mongoose = require('mongoose');
const axios = require('axios');
const db = require('@repo/db/client');
const { dataApiKey,dataApiUrl,Source} = require("../config/var");
const headers = {
    'Content-Type': 'application/json',
    'api-key': dataApiKey,
    'Accept': 'application/json'
  };

  async function apiPostRequest(action, body) {
    const response = await axios.post(`${dataApiUrl}/${action}`, body, { headers });
    return response.data;
  }
  router.post("/create-onramp-transaction", authMiddleware, async (req, res) => {
    const { provider, amount } = req.body;
    const user = req.user; // Extracted by authMiddleware

    if (!user || !user.id) {
        return res.status(401).json({
            message: "Unauthenticated request",
        });
    }

    const token = (Math.random() * 1000).toString();

    try {
        await prisma.onRampTransaction.create({
            data: {
                provider,
                status: "Processing",
                startTime: new Date(),
                token: token,
                userId: Number(user.id),
                amount: amount * 100,
            },
        });

        res.status(200).json({ message: "Done" });
    } catch (error) {
        console.error("Error creating on-ramp transaction:", error);
        res.status(500).json({
            message: "Failed to create transaction",
            error: error.message,
        });
    }
});

const router = express.Router();
router.post('/onramp', authenticateToken, async (req, res) => {
    const { provider, amount } = req.body;

    if (!provider || !amount) {
        return res.status(400).json({ message: 'Provider and amount are required' });
    }

    try {
        const token = (Math.random() * 1000).toString(); // Generate a mock token
        const transaction = await prisma.onRampTransaction.create({
            data: {
                provider,
                status: 'Processing',
                startTime: new Date(),
                token: token,
                userId: Number(req.user.id), // User ID from authenticated user
                amount: amount * 100 // Assuming the amount is in cents
            }
        });

        res.status(201).json({
            message: 'Transaction created successfully',
            transaction
        });
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get("/balance",authMiddleware, async (req, res) => {
    const userId = req.userId;
    const existaccount = await apiPostRequest('findOne', {
        dataSource: Source, 
        database: "paytmweb", 
        collection: "Account",
        filter: { userId: userId}
            
    });
    
    console.log("existaccount: ", existaccount);
    
    // Check if documents are found
    if (!existaccount.document || existaccount.document.length === 0) {
        return res.status(411).send({ message: "No matching account found." });
    }

    res.status(200).json({
        balance: existaccount.document.balance
    })
});

router.post("/transfer", authMiddleware, async (req, res) => {
    console.log("Transfer request received1");
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log("Transfer request received");

        const { amount, to } = req.body;
        const userId = req.userId;

        // Validate input data
        if (!amount || !to) {
            return res.status(400).json({ message: "Amount and recipient ID are required" });
        }

        // Retrieve sender's account
        const senderAccount = await apiPostRequest('findOne', {
            dataSource: Source,
            database: "paytmweb",
            collection: "Account",
            filter: { userId: userId }
        });

        if (!senderAccount.document || senderAccount.document.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Retrieve recipient's account
        const recipientAccount = await apiPostRequest('findOne', {
            dataSource: Source,
            database: "paytmweb",
            collection: "Account",
            filter: { userId: to }
        });

        if (!recipientAccount.document) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Recipient account not found" });
        }

        // Deduct balance from sender
        const decrementResponse = await apiPostRequest('updateOne', {
            dataSource: Source,
            database: "paytmweb",
            collection: "Account",
            filter: { userId: userId },
            update: { $inc: { balance: -amount } }
        });

        if (!decrementResponse.modifiedCount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Failed to deduct balance from sender." });
        }

        // Add balance to recipient
        const incrementResponse = await apiPostRequest('updateOne', {
            dataSource: Source,
            database: "paytmweb",
            collection: "Account",
            filter: { userId: to },
            update: { $inc: { balance: amount } }
        });

        if (!incrementResponse.modifiedCount) {
            // Rollback the sender's balance deduction if recipient update fails
            await apiPostRequest('updateOne', {
                dataSource: Source,
                database: "paytmweb",
                collection: "Account",
                filter: { userId: userId },
                update: { $inc: { balance: amount } }
            });
            await session.abortTransaction();
            return res.status(400).json({ message: "Transaction failed. Rolled back." });
        }

        // Commit the transaction
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


module.exports = router;