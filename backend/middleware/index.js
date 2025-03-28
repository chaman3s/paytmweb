const { JWT_SECRET } = require("../config/var");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    console.log("auth middleware");
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({mes:"check header"});
    }

    const token = authHeader.split(' ')[1];
    console.log("split:",token);

    try {
        console.log("go decoded");
        let decoded = jwt.verify(token, JWT_SECRET);
        
        console.log("userId:",decoded.userId);
        req.userId = decoded.userId;
        

        next();
    } catch (err) {
        return res.status(403).json({mess:"check jwt token"});
    }
};
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Bearer schema
    if (!token) return res.status(401).json({ message: 'Unauthorized request' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user; // Attach the decoded user to the request
        next();
    });
}

module.exports ={ authMiddleware, authenticateToken};
