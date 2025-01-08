// src/models/Feedback.js
const mongoose = require('mongoose');

// Define feedback schema
const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true }, // Product, Service, Support, etc.
  priority: { type: String, required: true }, // High, Medium, Low
  comments: { type: String, required: true }, // User's feedback message
  timestamp: { type: Date, default: Date.now } // When feedback was submitted
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
