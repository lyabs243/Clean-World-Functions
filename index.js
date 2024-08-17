const {onCall} = require("firebase-functions/v2/https");

const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const NotificationItem = require("./items/notification_item");

exports.sendNotification = onCall( async (request) => {
  const data = request.data;
  const notificationItem = new NotificationItem({
    title: data.title,
    description: data.description,
    image: data.image,
    data: data.data,
    type: data.type,
    creationDate: new Date(),
  });
  const id = await notificationItem.send();
  if (!id) {
    return {
      status: "error",
      message: "Failed to send notification",
    };
  }

  return {
    status: "success",
    message: "Notification sent",
    id: id,
  };
});

// Test operations
const {
  testNotification,
} = require("./tests");

exports.testNotification = testNotification;
