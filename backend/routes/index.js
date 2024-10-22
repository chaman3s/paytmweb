const express = require('express');
const userRouter = require("./authRoutes");
const accountRouter = require("./accountRoutes");

const router = express.Router();

router.use("/auth", userRouter);
router.use("/account", accountRouter);

module.exports = router;