import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const attendanceSchema = new Schema({
  id: {
    type: String,
    default: () => `self-stack-attendences-${uuidv4()}`,
    unique: true,
  },
    studentId: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent'], required: true }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
