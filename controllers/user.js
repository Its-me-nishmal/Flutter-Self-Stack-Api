
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import httpStatus from 'http-status';
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";


const { OK, INTERNAL_SERVER_ERROR } = httpStatus;


const userGet = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(OK).json(user);
    } catch (err) { next(err) }
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
        console.log(req.body)
        const newUser = new User({ ...req.body });
        const savedUser = await newUser.save();
        res.status(OK).json(savedUser);
    } catch (err) {
        next(err);
    }
}

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
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(OK).json(updatedUser);
    } catch (err) {
        next(err);
    }
}

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

        const token = jwt.sign({ userId: user._id }, 'this-for-self-stack-api', { expiresIn: '1h' });

        res.json({ token, userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
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
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updatePassword = async (req, res, next) => {
    try {
        // Access the user object attached by the 'verifyOTP' route
        const user = res.locals.user;

        // Ensure that the user object exists
        if (!user) {
            return res.status(400).json({ error: 'OTP verification not performed' });
        }

        const { newPassword } = req.body;

        user.password = newPassword;
        user.passwordResetOTP = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Example usage in your Express app
app.post('/update-password', updatePassword);



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
    updatePassword
};
