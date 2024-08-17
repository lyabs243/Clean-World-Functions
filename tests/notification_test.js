/* eslint-disable max-len */
const NotificationItem = require("../items/notification_item");
const logger = require("firebase-functions/logger");

/**
 * Test send notification
 * @return {boolean} - The result of the test.
 */
async function testSend() {
  const data = {
    title: "Test title",
    description: "Test description",
    image: "https://picsum.photos/200/300?random=18",
    data: {
      id: "test",
    },
    type: "news",
  };
  const notificationItem = new NotificationItem({
    title: data.title,
    description: data.description,
    image: data.image,
    data: data.data,
    type: data.type,
    creationDate: new Date(),
  });
  const id = await notificationItem.send();
  if (id) {
    logger.info("Notification sent", id);
    return true;
  }

  return false;
}

module.exports = {
  testSend,
};
