// NotificationController.js

import FCMService from '../services/notification.js';
import Notification from '../models/notification.js';
import User from '../models/userModel.js';

const serverKey = 'AAAAhLKYWow:APA91bGTi-aVF_DaQZEkF8VAoE3FoteC4ofpGEdr9sKl6-c_rtbVwjXr13mfqqX1oYZtQTx-_GYNquaWI6rTp82YFb8fok6w3zD57KeWAIVF-46ua_EMR8KUZ469m7SzmaZFd11ZC7Zp';

const fcmService = new FCMService(serverKey);

// Define API endpoint for sending notification
const sendNotificationToDevice = async (req, res) => {
  const { userIds, title, body } = req.body; // Assuming userIds is an array of user IDs
  try {
    const notifications = await Promise.all(userIds.map(async (userId) => {
      const user = await User.findById(userId);
      const deviceToken = user.notifyId;
      const response = await fcmService.sendNotificationToDevice(deviceToken, title, body);
      const notification = new Notification({
        userId,
        deviceToken,
        title,
        body,
        sentAt: new Date(),
      });
      await notification.save();
      return { userId, response };
    }));
    res.json({ success: true, notifications });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};


const getNotificationsByUserId = async (req, res) => {
  const userId = req.params.userId; // Extract userId from request parameters

  try {
    // Find notifications for the specified userId
    const notifications = await Notification.find({ userId });

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteNotificationById = async (req, res) => {
  const notificationId = req.params.notificationId; // Extract notificationId from request parameters

  try {
    // Delete the notification by its ID
    await Notification.findByIdAndDelete(notificationId);

    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export { sendNotificationToDevice , getNotificationsByUserId , deleteNotificationById };
