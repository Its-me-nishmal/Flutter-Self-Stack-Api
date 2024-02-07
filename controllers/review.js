// controllers/reviewController.js

import ReviewTask from '../models/ReviewTask.js';
import Student from '../models/userModel.js'; 

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

    // Combine student details with reviews
    const combinedData = {
      student: student,
      reviews: reviews
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
