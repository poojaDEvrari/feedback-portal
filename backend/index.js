const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv =require("dotenv").config();
const AuthRouter = require('./Routes/AuthRouter');
const feedbackRoute = require('./Routes/feedbackRouter');
const userRoutes =require('./Routes/userRoutes');
// Use environment variables for sensitive information


// Import the DB connection
require("./Models/db");

// Server port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Built-in middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To handle form submissions
app.use(cors()); // Enable CORS for all routes

// Register routes
app.use('/auth', AuthRouter);
app.use('/api/feedback', feedbackRoute); // Register feedback route under '/api/feedback'
app.use('/api/users',userRoutes);
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
