import { initializeApp, credential, messaging } from 'firebase-admin';

// Initialize Firebase Admin SDK with your credentials
import serviceAccount from './google.json' assert { type: 'json' };

initializeApp({
    credential: credential.cert(serviceAccount)
});

// Function to send notification
const sendNotification = async (notification, deviceToken = null) => {
    // Logic to send notification using Firebase Cloud Messaging
    // Example:
    const message = {
        notification: {
            title: notification.title,
            body: notification.body
        }
    };

    if (deviceToken) {
        message.token = deviceToken; // Send notification to specific device
    } else {
        message.topic = 'allDevices'; // Send notification to all devices subscribed to topic 'allDevices'
    }

    try {
        const response = await messaging().send(message);
        console.log('Notification sent successfully:', response);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

export default sendNotification;
