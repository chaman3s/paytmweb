const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

const MONGO_API_URL = process.env.MONGO_DATA_API_URL;
const MONGO_API_KEY = process.env.MONGO_DATA_API_KEY;
const MONGO_DATABASE = process.env.MONGO_DATA_database;
const MONGO_COLLECTION = process.env.MONGO_COLLECTION;

// Middleware to authenticate user using JWT
const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
};

// Function to call MongoDB Data API
const mongoRequest = async (action, body) => {
    try {
        const response = await axios.post(`${MONGO_API_URL}/${action}`, {
            dataSource: "Cluster0",
            database: MONGO_DATABASE,
            collection: MONGO_COLLECTION,
            ...body
        }, {
            headers: { "Content-Type": "application/json", "api-key": MONGO_API_KEY }
        });
        return response.data;
    } catch (error) {
        console.error("MongoDB API Error:", error.response?.data || error.message);
        throw new Error("Database error");
    }
};

// P2P Transfer API
router.post("/p2p-transfer", authenticateUser, async (req, res) => {
    const { to, amount } = req.body;
    const from = req.userId;

    if (!to || !amount) {
        return res.status(400).json({ message: "Invalid input data" });
    }

    try {
        // Fetch sender and recipient
        const sender = await mongoRequest("findOne", { filter: { _id: { "$oid": from } } });
        const recipient = await mongoRequest("findOne", { filter: { number: to } });

        if (!sender.document) {
            return res.status(404).json({ message: "Sender not found" });
        }
        if (!recipient.document) {
            return res.status(404).json({ message: "Recipient not found" });
        }
        if (sender.document.balance < amount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        // Start MongoDB Transaction
        await Promise.all([
            mongoRequest("updateOne", {
                filter: { _id: { "$oid": from } },
                update: { "$inc": { balance: -amount } }
            }),
            mongoRequest("updateOne", {
                filter: { number: to },
                update: { "$inc": { balance: amount } }
            })
        ]);

        res.status(200).json({ message: "Transfer successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
