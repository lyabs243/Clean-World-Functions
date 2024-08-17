const {onCall} = require("firebase-functions/v2/https");
const {onSchedule} = require("firebase-functions/v2/scheduler");

const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const NotificationItem = require("./items/notification_item");
const NewsItem = require("./items/news_item");

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

// every 30 minuters, check for pending news
exports.publishScheduledNews = onSchedule("every 30 minutes", async () => {
  await NewsItem.publishScheduledNews();
});

// Test operations
const {
  testNotification,
  testNews,
} = require("./tests");

exports.testNotification = testNotification;
exports.testNews = testNews;
