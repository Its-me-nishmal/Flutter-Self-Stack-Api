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
          const scheduleDate = review.scheduleDate;
          const completedDate = review.completedDate;

          // Calculate the number of days taken for completion
          const daysTaken = Math.floor((completedDate - scheduleDate) / (1000 * 60 * 60 * 24));

          // Determine the flag based on the number of days taken
          let flag = '';
          if (daysTaken <= 7) {
              flag = 'within 7 days';
          } else if (daysTaken === 3) {
              flag = '3 days after';
          } else if (daysTaken === 5) {
              flag = '5 days after';
          } else if (daysTaken === 10) {
              flag = '10 days after';
          }

          return {
              reviewId: review._id,
              taskId: review.taskId,
              taskName: task ? task.task_name : 'Task not found',
              points: review.points,
              advisor: review.advisor,
              reviewver: review.reviewver,
              scheduleDate: scheduleDate ? review.scheduleDate.toISOString().split('T')[0] : null,
              completedDate: completedDate ? review.completedDate.toISOString().split('T')[0] : null,
              reviewDetails: review.reviewDetails,
              pendingTopics: review.pendingTopics,
              remarks: review.remarks,
              daysTaken: daysTaken,
              flag: flag // Add the flag to the object
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


export const getReviewByIdAndStudent = async (req, res) => {
  try {
    const { studentId, reviewId } = req.params;

    // Fetch student details
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Fetch review for the student with the specified review ID
    const review = await ReviewTask.findOne({ _id: reviewId, student: studentId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Fetch task name for the review
    const course = await CourseModel.findOne({ 'tasks._id': review.taskId });
    const task = course ? course.tasks.find(task => task._id.toString() === review.taskId) : null;

    const scheduleDate = review.scheduleDate;
    const completedDate = review.completedDate;

    // Calculate the number of days taken for completion
    const daysTaken = completedDate ? Math.floor((completedDate - scheduleDate) / (1000 * 60 * 60 * 24)) : null;

    // Determine the flag based on the number of days taken
    let flag = '';
    if (daysTaken <= 7) {
      flag = 'within 7 days';
    } else if (daysTaken === 3) {
      flag = '3 days after';
    } else if (daysTaken === 5) {
      flag = '5 days after';
    } else if (daysTaken === 10) {
      flag = '10 days after';
    }

    // Construct the response object
    const reviewDetails = {
      reviewId: review._id,
      taskId: review.taskId,
      taskName: task ? task.task_name : 'Task not found',
      points: review.points,
      advisor: review.advisor,
      reviewver: review.reviewver,
      scheduleDate: scheduleDate ? review.scheduleDate.toISOString().split('T')[0] : null,
      completedDate: completedDate ? review.completedDate.toISOString().split('T')[0] : null,
      reviewDetails: review.reviewDetails,
      pendingTopics: review.pendingTopics,
      remarks: review.remarks,
      daysTaken: daysTaken,
      flag: flag
    };

    res.json(reviewDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Create or update review task
export const saveReview = async (req, res) => {
  try {
    const { studentId, ...reviewData } = req.body;
    let review;

    if (req.method === 'POST') {
      review = new ReviewTask({ ...reviewData, student: studentId });
    } else if (req.method === 'PUT') {
      const { reviewId } = req.params;
      let updateData = { ...reviewData, student: studentId };
      
      // Check if the status of review is 'Task Completed' or 'Need Improvement'
      if (reviewData.reviewDetails && reviewData.reviewDetails.length > 0) {
        const statusOfReview = reviewData.reviewDetails[0].status;
        if (statusOfReview === 'Task Completed' || statusOfReview === 'Need Improvement') {
          // Set the completedDate to current date if review status is 'Task Completed' or 'Need Improvement'
          updateData.completedDate = Date.now();
        }
      }

      review = await ReviewTask.findByIdAndUpdate(reviewId, updateData, { new: true });
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid request method' });
    }

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
