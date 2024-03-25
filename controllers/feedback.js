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
        // Fetch all feedback documents
        const feedbacks = await Feedback.find();

        // Fetch task names for each feedback
        const formattedFeedbacks = await Promise.all(feedbacks.map(async feedback => {
            // Find the course associated with the feedback
            const course = await CourseModel.findById({ tasks: feedback.taskId });

            let taskName = 'Unknown Task';
            // If course is found, find the task within it
            if (course) {
                const task = course.tasks.find(task => task._id === feedback.taskId);
                if (task) {
                    taskName = task.task_name;
                }
            }

            // Fetch user associated with the feedback
            // Fetch user associated with the feedback
const user = await User.findOne({ _id: feedback.userId });


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
