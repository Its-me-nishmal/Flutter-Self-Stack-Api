import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

// Feedback Schema
const feedbackSchema = new Schema({
    _id: { type: String, default: () => `self-stack-feedback-${uuidv4()}`, required: true },
    userId: { type: String, ref: 'User', required: true },
    purpose: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;