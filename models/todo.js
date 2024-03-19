// models/todoModel.js
import mongoose from 'mongoose';

const todoSchema = mongoose.Schema({
  title: String,
  subtitle: String,
  date: Date,
  autoDeleteDate: Date,
  isPublic: { type: Boolean, default: false },
  createdBy: { type: String },
  percentage: { type: Number, default: 99 },
  status: { type: String, default: 'pending' } // 'pending', 'completed', etc.
});

export default mongoose.model('Todo', todoSchema);

