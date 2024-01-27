// taskModel.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    _id: { type: String, default: () => `self-stack-task-${uuidv4()}` },
    userId: { type: String, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String },
    completed: { type: Boolean, default: false }
}, { timestamps: true });

export const TaskModel = mongoose.model('Task', taskSchema);
