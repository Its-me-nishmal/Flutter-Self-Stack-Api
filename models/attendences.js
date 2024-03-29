import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const attendanceSchema = new Schema({
  id: {
    type: String,
    default: () => `self-stack-attendences-${uuidv4()}`,
    unique: true,
  },
    advisorId: { type: String },
    studentId: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now() },
    status: { type: String, required: true }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
