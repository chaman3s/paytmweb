const express = require('express');
const userRouter = require("./authRoutes");
const accountRouter = require("./accountRoutes");

const router = express.Router();
console.log("ok");

router.use("/auth", userRouter);
console.log("ok1");
router.use("/account", accountRouter);

module.exports = router;