// FCMService.js

import FCM from 'fcm-node';

class FCMService {
  constructor(serverKey) {
    this.fcm = new FCM(serverKey);
  }

  sendNotificationToDevice(deviceToken, title, body) {
    const message = {
      to: deviceToken,
      notification: {
        title: title,
        body: body,
      },
    };

    return new Promise((resolve, reject) => {
      this.fcm.send(message, function(err, response) {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }
}

export default FCMService;
