// controllers/feedbackController.js
import Feedback from "../models/feedbackModel.js";
import User from "../models/userModel.js";
import { TaskModel } from "../models/taskModel.js";

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
        // Fetch all feedback documents
        const feedbacks = await Feedback.find();

        // Fetch related user and task documents for each feedback
        const formattedFeedbacks = await Promise.all(feedbacks.map(async feedback => {
            // Fetch user document
            const user = await User.findById(feedback.userId).select('name');

            // Fetch task document
            let taskName = 'No Task'; // Default value if task not found
            if (feedback.taskId) {
                const task = await TaskModel.findById(feedback.taskId).select('task_name');
                if (task) {
                    taskName = task.task_name;
                } else {
                    taskName = 'not found'
                }
            }

            // Construct formatted feedback object
            return {
                _id: feedback._id,
                userId: user ? user.name : 'Unknown User',
                taskId: taskName,
                content: feedback.content,
                date: feedback.date
            };
        }));

        res.json(formattedFeedbacks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
