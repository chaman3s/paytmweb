// import express from "express";
// import axios from "axios";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();
// const router = express.Router();

// const MONGO_API_URL = process.env.MONGO_DATA_API_URL;
// const API_KEY = process.env.MONGO_API_KEY;
// const DB_NAME = process.env.DATABASE_NAME;
// const COLLECTION = process.env.COLLECTION_NAME;
// const JWT_SECRET = process.env.JWT_SECRET;

// // **Middleware to Verify JWT and Extract User ID**
// const authenticateUser = (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ error: "Access denied, no token provided" });

//     try {
//         const decoded = jwt.verify(token, JWT_SECRET);
//         req.userId = decoded.userId;
//         next();
//     } catch (error) {
//         return res.status(403).json({ error: "Invalid token" });
//     }
// };

// // **Get User Balance**
// router.get("/balance", authenticateUser, async (req, res) => {
//     try {
//         const response = await axios.post(
//             MONGO_API_URL,
//             {
//                 dataSource: "Cluster0",
//                 database: DB_NAME,
//                 collection: COLLECTION,
//                 filter: { userId: req.userId },
//             },
//             { headers: { "api-key": API_KEY } }
//         );

//         const user = response.data.document;
//         if (!user) return res.json({ amount: 0, locked: 0 });

//         res.json({ amount: user.amount, locked: user.locked });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Error fetching balance" });
//     }
// });

// // **Get User Transactions**
// router.get("/transactions", authenticateUser, async (req, res) => {
//     try {
//         const response = await axios.post(
//             MONGO_API_URL,
//             {
//                 dataSource: "Cluster0",
//                 database: DB_NAME,
//                 collection: COLLECTION,
//                 filter: { userId: req.userId },
//                 projection: { transactions: 1 },
//             },
//             { headers: { "api-key": API_KEY } }
//         );

//         const user = response.data.document;
//         if (!user || !user.transactions) return res.json([]);

//         res.json(user.transactions);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Error fetching transactions" });
//     }
// });
// router.post("/createonramp", authenticateUser, async (req, res) => {
//     try {
//         const { amount, provider } = req.body;
//         if (!amount || !provider) {
//             return res.status(400).json({ error: "Amount and provider are required" });
//         }

//         const token = Math.random().toString();
//         const newTransaction = {
//             userId: req.userId,
//             amount,
//             status: "Processing",
//             startTime: new Date(),
//             provider,
//             token
//         };

//         await axios.post(
//             MONGO_API_URL,
//             {
//                 dataSource: "Cluster0",
//                 database: DB_NAME,
//                 collection: COLLECTION,
//                 document: newTransaction,
//             },
//             { headers: { "api-key": API_KEY } }
//         );

//         res.json({ message: "On-ramp transaction added", transaction: newTransaction });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Error creating transaction" });
//     }
// });
// export default router;
