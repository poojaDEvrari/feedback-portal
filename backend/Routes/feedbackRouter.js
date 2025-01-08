const express = require("express");
const FeedbackModel = require("../Models/feedback");
const authenticateToken = require("../Middlewares/Auth");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Route to submit feedback
router.post("/submit", authenticateToken, async (req, res) => {
    try {
        const { category, priority, comments } = req.body;

        if (!category || !priority || !comments) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const feedback = new FeedbackModel({
            userId: req.userId, // Attach userId from middleware
            category,
            priority,
            comments,
        });

        console.log("Feedback data to be saved:", feedback);

        await feedback.save();
        res.status(201).json({ message: "Feedback submitted successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
});

// Route to get feedbacks by category (product, service, etc.)
router.get("/feedbacks", async (req, res) => {
    const { category } = req.query;  // Get category from query params

    try {
        // If no category is provided, return all feedback
        const filter = category ? { category } : {};
        const feedbacks = await FeedbackModel.find(filter);

        if (!feedbacks.length) {
            return res.status(404).json({ message: "No feedback found", success: false });
        }

        res.status(200).json({ success: true, data: feedbacks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
});

// Route to get aggregated analytics (e.g., feedback count by priority or category)
router.get("/analytics", async (req, res) => {
    try {
        // Aggregate feedback by priority
        const priorityCounts = await FeedbackModel.aggregate([
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]);

        // Aggregate feedback by category
        const categoryCounts = await FeedbackModel.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                priorityCounts,
                categoryCounts,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch analytics", success: false });
    }
});

// Route to download feedback data as an Excel file
router.get("/download", authenticateToken, async (req, res) => {
    try {
        const feedbacks = await FeedbackModel.find();
        if (!feedbacks.length) {
            return res.status(404).json({ message: "No feedback found", success: false });
        }

        const formattedFeedbacks = feedbacks.map(feedback => ({
            category: feedback.category,
            priority: feedback.priority,
            comments: feedback.comments,
            userId: feedback.userId,
            createdAt: feedback.createdAt,
        }));

        res.setHeader("Content-Disposition", "attachment; filename=feedbacks.json");
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(formattedFeedbacks);
    } catch (error) {
        console.error("Failed to download feedbacks:", error);
        res.status(500).json({ message: "Failed to download feedbacks", success: false });
    }
});

module.exports = router;
