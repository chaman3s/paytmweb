const { JWT_SECRET } = require("../config/var");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    console.log("auth middleware");
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({mrss:"check header"});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("userId:",decoded.userId);
        req.userId = decoded.userId;
        

        next();
    } catch (err) {
        return res.status(403).json({mess:"check jwt token"});
    }
};

module.exports = authMiddleware;
