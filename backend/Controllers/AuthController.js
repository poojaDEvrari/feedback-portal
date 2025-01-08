const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");


// controllers/authController.js

const signup = async (req, res) => {
    try {
        const { name, email, password, role = 'client' } = req.body; // Default role is client
        const user = await UserModel.findOne({ email });

        if (user) {
            return res.status(409).json({ message: 'User already exists, you can log in', success: false });
        }

        const userModel = new UserModel({ name, email, password, role });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();

        res.status(201).json({ message: 'Signup successful', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};



// controllers/authController.js

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Authentication failed, incorrect email or password';

        if (!user) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, role: user.role }, // Include role in JWT
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            success: true,
            jwtToken,
            name: user.name,
            role: user.role,  // Send the role back to the frontend
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};


module.exports = {
    signup,
    login
}