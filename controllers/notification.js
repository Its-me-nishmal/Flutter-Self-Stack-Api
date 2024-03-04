// NotificationController.js

import FCMService from '../services/notification.js';
import Notification from '../models/notification.js'

const serverKey = 'AAAAhLKYWow:APA91bGTi-aVF_DaQZEkF8VAoE3FoteC4ofpGEdr9sKl6-c_rtbVwjXr13mfqqX1oYZtQTx-_GYNquaWI6rTp82YFb8fok6w3zD57KeWAIVF-46ua_EMR8KUZ469m7SzmaZFd11ZC7Zp';

const fcmService = new FCMService(serverKey);

// Define API endpoint for sending notification
const sendNotificationToDevice = async (req, res) => {

  const { deviceToken, title, body } = req.body;

  try {
    const response = await fcmService.sendNotificationToDevice( userId, deviceToken, title, body);
    const notification = new Notification({
      userId,
      deviceToken,
      title,
      body,
      sentAt: new Date(),
    });
    await notification.save();
    res.json({ success: true, response });
  } catch (error) {
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

export { sendNotificationToDevice , getNotificationsByUserId };
