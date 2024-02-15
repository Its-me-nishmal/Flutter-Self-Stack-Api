import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const attendanceSchema = new Schema({
  id: {
    type: String,
    default: () => `self-stack-attendences-${uuidv4()}`,
    unique: true,
  },
    advisorId: { type: String, required: true },
    studentId: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now() },
    status: { type: String, enum: ['Present', 'Absent'], required: true }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
