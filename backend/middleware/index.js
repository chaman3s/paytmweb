const { JWT_SECRET } = require("../config/var");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    console.log("Auth middleware triggered");

    const authHeader = req.headers.authorization;
    console.log("Received Authorization Header:", authHeader); // Debugging line

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];

    try {
        console.log("Decoding JWT...");
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded userId:", decoded.userId);

        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(403).json({ message: "Invalid or expired token" });
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
