
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import httpStatus from 'http-status';
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import {CourseModel} from '../models/taskModel.js';
import Attendance from '../models/attendences.js';
import ReviewTask from '../models/reviewsModel.js';



const { OK, INTERNAL_SERVER_ERROR } = httpStatus;


import fs from 'fs';
import path from 'path';

const userGet = async (req, res, next) => {
    try {
        // Fetch user data by ID
        const user = await User.findById(req.params.id);

        // If user found, proceed
        if (user) {
            // Read contents of program_motive.json file
            const programMotiveData = fs.readFileSync(path.join('../services/program_motive.json'));
            const quotes = JSON.parse(programMotiveData);

            // Select a random quote and author
            const randomIndex = Math.floor(Math.random() * quotes.length);
            const { quote: randomQuote, author: randomAuthor } = quotes[randomIndex];

            // Add random quote and author to user object
            user.randomQuote = randomQuote;
            user.randomAuthor = randomAuthor;

            // Calculate age based on date of birth
            if (user.dateOfBirth) {
                const birthDate = new Date(user.dateOfBirth);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                user.age = age;
                const formattedDateOfBirth = `${birthDate.getFullYear()}-${(birthDate.getMonth() + 1).toString().padStart(2, '0')}-${birthDate.getDate().toString().padStart(2, '0')}`;
                user.dateOfBirth = formattedDateOfBirth;
            }
            
            // Fetch attendance data for the user for today's date
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for comparison
            const attendanceData = await Attendance.find({ 
                studentId: req.params.id,
                date: { $gte: today } 
            });

            // Fetch task name based on task ID
            const taskData = await CourseModel.findById(user.domain);

            // Calculate count of review statuses
            const reviewStatusCounts = await ReviewTask.aggregate([
                { $match: { student: req.params.id } },
                {
                    $group: {
                        _id: "$reviewDetails.status",
                        count: { $sum: 1 }
                    }
                }
            ]);

            // Create a map to store review status counts
            const reviewStatusMap = {};
            reviewStatusCounts.forEach(status => {
                reviewStatusMap[status._id] = status.count;
            });

            // Combine user data, attendance data, task data, and review status counts into a single object
            const combinedData = {
                user: user.toObject(), // Convert Mongoose document to plain JavaScript object
                attendance: attendanceData,
                domain: taskData ? taskData.course_name : null,
                reviewStatusCounts: reviewStatusMap,
                randomQuote,
                randomAuthor
            };

            // Send combined data as response
            res.status(200).json(combinedData);
        } else {
            // If user not found, send appropriate response
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        // If an error occurs, pass it to the error handling middleware
        next(err);
    }
}




const userGetAll = async (req, res, next) => {
    try {
        const user = await User.find();
        res.status(OK).json(user);
    } catch (err) { next(err) }
}

const userDel = async (req, res, next) => {
    try {
        const user = await User.findOneAndDelete(req.params.id);
        res.status(OK).json(user);
    } catch (err) { next(err) }
}

const userDelAll = async (req, res, next) => {
    try {
        const user = await User.deleteMany();
        res.status(OK).json(user);
    } catch (err) { next(err) }
}

const userCreate = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // If the email already exists, return a conflict status
            return res.status(409).json({ error: 'Email already exists' });
        }

        // If the email doesn't exist, create a new user
        const newUser = new User({ ...req.body });
        const savedUser = await newUser.save();

        // Return the newly created user
        res.status(200).json(savedUser);
    } catch (err) {
        // Pass any errors to the error-handling middleware
        next(err);
    }
};


const userCreateMultiple = async (req, res, next) => {
    try {
        const users = req.body.map(user => ({ ...user }));
        const createdUsers = await User.create(users);
        res.status(OK).json(createdUsers);
    } catch (err) {
        next(err);
    }
}


const userUpdate = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

        // Check if domain is not 'No'
        if (updatedUser.domain === 'No') {
            res.status(200).json(updatedUser);
            return;
        }

        // Remove user from existing courses
        const userCourses = await CourseModel.find({ students: userId });
        await Promise.all(userCourses.map(async (course) => {
            await CourseModel.findByIdAndUpdate(course._id, {
                $pull: { students: userId }
            });
        }));

        // Check if domain is set in req.body and add user to a specific course
        if (req.body.domain) {
            const specificCourse = await CourseModel.findOne({ _id: req.body.domain });
            if (specificCourse) {
                await CourseModel.findByIdAndUpdate(specificCourse._id, {
                    $addToSet: { students: userId }
                });

                // Check if there are tasks in the course, and if yes, add the first task to started tasks
                if (specificCourse.tasks.length > 0) {
                    const firstTaskId = specificCourse.tasks[0]._id;
                    await User.findByIdAndUpdate(userId, {
                        $addToSet: { tasksStarted: { taskId: firstTaskId } }
                    });
                }
            }
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        next(err);
    }
};




const userUpdateMultiple = async (req, res, next) => {
    try {
        const updates = req.body;
        const updatedUsers = [];

        for (const update of updates) {
            const updatedUser = await User.findByIdAndUpdate(update.id, update.fieldsToUpdate, { new: true });
            updatedUsers.push(updatedUser);
        }

        res.status(OK).json(updatedUsers);
    } catch (err) {
        next(err);
    }
}

const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user._id, userRoll: user.roll }, 'this-for-self-stack-api', { expiresIn: '1h' })

        res.json({ token, userId: user._id });
    } catch (error) {
        console.error(error);
        next(error)
    }
};

function generateOTP () {
    const randomBytes = crypto.randomBytes(3); 
    const otp = parseInt(randomBytes.toString('hex'), 16).toString().slice(0, 6);
    return otp;
  }

const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Send email with OTP
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`
    });
};

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate OTP
        const otp = generateOTP();

        // Store OTP in the database
        user.passwordResetOTP = otp;
        user.passwordResetExpires = Date.now() + 3600000; 
        await user.save();

        // Send OTP via email
        await sendOTPEmail(email, otp);

        res.status(OK).json({ message: 'Password reset OTP sent successfully' });
    } catch (error) {
        console.error(error);
        next(error)
    }
};

const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.passwordResetOTP !== otp || user.passwordResetExpires < Date.now()) {
            return res.status(401).json({ error: 'Invalid or expired OTP' });
        }

        // Attach the user object to the response for later use in the 'updatePassword' route
        res.locals.user = user;

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error(error);
        next(error)
    }
};

const updatePassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        // Ensure that the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user has completed OTP verification
        if (!user.passwordResetOTP || !user.passwordResetExpires || user.passwordResetExpires < Date.now()) {
            return res.status(400).json({ error: 'OTP verification not performed or expired' });
        }

        user.password = newPassword;
        user.passwordResetOTP = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        next(error)
    }
};


const loginWithGoogle = async (req, res, next) => {
    try {
        console.log(req.body);
        const { email, name, googleId, image } = req.body;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            const newUser = new User({ email, name, googleId, image });
            const savedUser = await newUser.save();

            res.status(OK).json(savedUser);
        } else {
            existingUser.name = name;
            existingUser.googleId = googleId;
            existingUser.image = image;
            const updatedUser = await existingUser.save();

            res.status(OK).json(updatedUser);
        }
    } catch (err) {
        next(err);
    }
};

export default {
    userGet,
    userGetAll,
    userDel,
    userDelAll,
    userCreate,
    userUpdate,
    userCreateMultiple,
    userUpdateMultiple,
    signIn,
    forgotPassword,
    verifyOTP,
    updatePassword,
    loginWithGoogle
};
