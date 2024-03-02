// notificationRoutes.js

import express from 'express';
import sendNotificationController from '../controllers/notification.js';

const router = express.Router();

// Route to send notification
router.post('/send', sendNotificationController);

export default router;
