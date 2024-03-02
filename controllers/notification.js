// // notificationController.js

// import sendNotification from '../services/notification.js';
// import Notification from '../models/notification.js';

// // Controller function to send notification
// const sendNotificationController = async (req, res) => {
//     const { title, body, userId } = req.body;
//     // Validate input data if necessary

//     try {
//         // Create notification object
//         const notification = Notification(title, body, userId);
//         // Send notification
//         await sendNotification(notification);
//         res.status(200).send('Notification sent successfully');
//     } catch (error) {
//         console.error('Error sending notification:', error);
//         res.status(500).send('Internal server error');
//     }
// };

// export default sendNotificationController;
