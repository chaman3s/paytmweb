const express = require('express');
const userRouter = require("./authRoutes");
const accountRouter = require("./accountRoutes");
const p2p = require("./p2pTransfer");
const transactions = require("./transcationRoutes");
const connectionRoutes = require("./connectionRoutes")

const router = express.Router();
console.log("ok");

router.use("/auth", userRouter);
router.use("/account", accountRouter);
router.use("/network", connectionRoutes);
router.use("/p2p",p2p);




module.exports = router;