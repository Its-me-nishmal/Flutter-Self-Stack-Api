// notificationRoutes.js

import express from 'express';
import { sendNotificationToDevice ,getNotificationsByUserId , deleteNotificationById } from '../controllers/notification.js';

const router = express.Router();

// Route to send notification
router.post('/send', sendNotificationToDevice);
router.get('/:userId', getNotificationsByUserId);
router.delete('/:notificationId', deleteNotificationById);

export default router;
