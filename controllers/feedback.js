// controllers/feedbackController.js
import Feedback from "../models/feedbackModel.js";
import User from "../models/userModel.js";
import { CourseModel } from "../models/taskModel.js";

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
        const feedbacks = await Feedback.find()
            .populate({
                path: 'userId',
                model: User,
                select: 'name' // Select only the 'name' field from the User model
            })
            .populate({
                path: 'taskId',
                model: CourseModel,
                select: 'task_name' // Select only the 'name' field from the Task model
            });

        feedbacks.map(d=>console.log(d))
        const formattedFeedbacks = feedbacks.map(feedback => (
            {
            _id: feedback._id,
            userId: feedback.userId ? feedback.userId.name : 'Unknown User',
            taskId: feedback.taskId ? feedback.taskId.task_name : 'Unknown Task',
            content: feedback.content,
            date: feedback.date
        }));

        res.json(formattedFeedbacks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}