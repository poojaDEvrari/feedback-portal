const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"
    
    if (!token) {
        return res.status(401).json({ message: "No token provided, unauthorized", success: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded._id; // Attach userId to request
        req.role = decoded.role; // Optional: Attach role if needed
        next(); // Pass control to next middleware or route
    } catch (err) {
        console.error(err);
        res.status(403).json({ message: "Invalid or expired token", success: false });
    }
};


module.exports = authenticateToken;
