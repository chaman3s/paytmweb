const express = require('express');
const router = express.Router();
const auth = require("./authRoutes");
router.use("/auth",auth);
module.exports = router;