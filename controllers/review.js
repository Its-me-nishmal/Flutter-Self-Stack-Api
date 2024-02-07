// controllers/reviewController.js

import ReviewTask from '../models/reviewsModel.js';
import Student from '../models/userModel.js'; 

import { CourseModel } from '../models/taskModel.js'; // Import CourseModel

export const getReviewsByStudent = async (req, res) => {
    try {
      const { studentId } = req.params;
  
      // Fetch student details
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Fetch reviews for the student
      const reviews = await ReviewTask.find({ student: studentId });
  
      // Fetch task name for each review
      const reviewsWithTaskName = await Promise.all(reviews.map(async (review) => {
        // Find the course containing the task
        const course = await CourseModel.findOne({ 'tasks._id': review.taskId });
        const task = course ? course.tasks.find(task => task._id.toString() === review.taskId) : null;
        return {
          taskId: review.taskId,
          taskName: task ? task.task_name : 'Task not found',
          points: review.points,
          advisor: review.advisor,
          reviewver: review.reviewver,
          scheduleDate: review.scheduleDate,
          completedDate: review.completedDate,
          reviewDetails: review.reviewDetails,
          pendingTopics: review.pendingTopics,
          remarks: review.remarks
        };
      }));
  
      // Calculate total review score
      const totalScore = reviews.reduce((acc, review) => acc + review.points, 0);
  
      // Combine student details with reviews and total score
      const combinedData = {
        totalScore: totalScore,
        student: student,
        reviews: reviewsWithTaskName,
      };
  
      res.json(combinedData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

  

// Create or update review task
export const saveReview = async (req, res) => {
  try {
    const { studentId, ...reviewData } = req.body; // Extract studentId and review data
    let review;

    if (req.method === 'POST') {
      // If it's a POST request, create a new review
      review = new ReviewTask({ ...reviewData, student: studentId });
    } else if (req.method === 'PUT') {
      // If it's a PUT request, update the existing review
      const { reviewId } = req.params;
      review = await ReviewTask.findByIdAndUpdate(reviewId, { ...reviewData, student: studentId }, { new: true });
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid request method' });
    }

    const savedReview = await review.save(); // Save the review

    res.status(201).json(savedReview); // Return the saved review
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
