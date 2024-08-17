/* eslint-disable max-len */
const NewsItem = require("../items/news_item");

/**
 * Test publish schedule news
 * @return {boolean} - The result of the test.
 */
async function testPublishScheduleNews() {
  const totalPublished = await NewsItem.publishScheduledNews();
  return totalPublished > 0;
}

module.exports = {
  testPublishScheduleNews,
};
