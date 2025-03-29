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

const authRefferalMiddleware = (req, res, next) => {
    
    if (req.query.ref) {
        console.log("Referral code detected:", req.query.ref);
        req.session.referralCode = req.query.ref; // Store referral code in session
    } else{
        return res.status(403).json({ message: "Missing or invalid Invite code header" });
    }
    const authHeader = req.headers.authorization;
    console.log("Received Authorization Header:", authHeader); // Debugging line

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("Redirecting to signin page...");
        return res.status(403).redirect(`http://localhost:3000/auth/signin`);
        console.log("Redirecting to signin page...");
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
}

module.exports ={ authMiddleware,authRefferalMiddleware};
