// notificationModel.js

import mongoose from 'mongoose';

// Define the schema for the Notification model
const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  deviceToken: { type: String, required: true },
  sentAt: { type: Date, default: Date.now }
});

// Create the Notification model
const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
