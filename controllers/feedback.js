// controllers/feedbackController.js
import Feedback from "../models/feedbackModel.js";

export const postFeedback = async (req, res) => {
    try {
        const feedback = new Feedback({
            ...req.body
        });

        await feedback.save();

        res.status(201).json({ success: true, feedback });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getfeedback = async (req, res) => {
        try {
            const feedbacks = await Feedback.find();
            res.json(feedbacks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }