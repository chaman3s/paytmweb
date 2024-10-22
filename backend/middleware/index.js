const { JWT_SECRET } = require("../config/var");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    console.log("auth middleware");
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.userId;

        next();
    } catch (err) {
        return res.status(403).json({});
    }
};

module.exports = authMiddleware;
