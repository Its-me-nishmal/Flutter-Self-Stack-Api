// notificationRoutes.js

import express from 'express';
import { sendNotificationToDevice ,getNotificationsByUserId } from '../controllers/notification.js';

const router = express.Router();

// Route to send notification
router.post('/send', sendNotificationToDevice);
router.get('/notifications/:userId', getNotificationsByUserId);

export default router;
