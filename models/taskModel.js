import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const Schema = mongoose.Schema;

// Subtitle schema
const SubtitleSchema = new Schema({
  _id: { type: String, required: true, default: () => `self-stack-subtitle-${uuidv4()}` },
  subtitle_name: { type: String, required: true },
  points: [{ type: String, required: true }]
});

// Task schema
const TaskSchema = new Schema({
  _id: { type: String, required: true, default: () => `self-stack-task-${uuidv4()}` },
  task_name: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  subtitle: [SubtitleSchema]
});

// Course schema
const CourseSchema = new Schema({
  _id: { type: String, required: true, default: () => `self-stack-courses-${uuidv4()}` },
  course_name: { type: String, required: true },
  students: [{ type: String, required: true }],
  tasks: [TaskSchema]
});

const TaskModel = mongoose.model('Task', CourseSchema);

export default TaskModel;
