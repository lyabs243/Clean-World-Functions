require("dotenv").config();
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const {testSend} = require("./tests/notification_test");

const testAccessToken = process.env.TEST_ACCESS_TOKEN;

exports.testNotification = onRequest(async (request, response) => {
  logger.info("====> Start Test Notification");

  const accessToken = request.body.accessToken;
  if (accessToken !== testAccessToken) {
    response.send("Access denied");
    return;
  }

  const methodsList = [
    testSend,
  ];
  const totalMethods = methodsList.length;
  let totalSuccess = 0;

  for (const method of methodsList) {
    const res = await method();
    if (res) {
      totalSuccess++;
    } else {
      logger.error("Error testing method ", {method});
    }
  }

  logger.info("====> End Test Notification");

  response.send(`Test Notification completed ` +
    `${totalSuccess}/${totalMethods} !`);
});
