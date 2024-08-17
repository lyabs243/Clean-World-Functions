const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

const NotificationItem = require("./notification_item");

const collectionNews = "clean_news";

const fieldNewsTitle = "title";
const fieldNewsDescription = "description";
const fieldNewsPhotoUrl = "photo_url";
const fieldNewsDate = "date";
const fieldNewsStatus = "status";
const fieldNewsCreatedBy = "created_by";
const fieldNewsCreatedAt = "created_at";

/**
 * Represents a news item.
 * @class
 */
class NewsItem {
  /**
     * Creates a new instance of the NewsItem class.
     * @constructor
     * @param {string} title - The title of the news.
     * @param {string} description - The description of the news.
     * @param {string} photoUrl - The photo URL of the news.
     * @param {string} date - The date of the news.
     * @param {string} status - The status of the news.
     * @param {string} createdBy - The user who created the news.
     * @param {string} createdAt - The creation date of the news.
     */
  constructor({title, description = "", photoUrl = "", date, status, createdBy,
    createdAt}) {
    this.title = title;
    this.description = description;
    this.photoUrl = photoUrl;
    this.date = date;
    this.status = status;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
  }

  /**
   * Get news object from map
   * @param {*} map - The map of the news.
   * @return {NewsItem} - The news object.
   */
  static fromMap(map) {
    return new NewsItem({
      title: map[fieldNewsTitle],
      description: map[fieldNewsDescription],
      photoUrl: map[fieldNewsPhotoUrl],
      date: map[fieldNewsDate],
      status: map[fieldNewsStatus],
      createdBy: map[fieldNewsCreatedBy],
      createdAt: map[fieldNewsCreatedAt],
    });
  }

  /**
     * Get news object map
     * @return {*} - The map of the news.
     */
  toMap() {
    const map = {};
    map[fieldNewsTitle] = this.title;
    map[fieldNewsDescription] = this.description;
    map[fieldNewsPhotoUrl] = this.photoUrl;
    map[fieldNewsDate] = this.date;
    map[fieldNewsStatus] = this.status;
    map[fieldNewsCreatedBy] = this.createdBy;
    map[fieldNewsCreatedAt] = this.createdAt;
    return map;
  }

  /**
   * Get all pending news with date before the current date,
   *  update their status to published and send notifications.
   */
  static async publishScheduledNews() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const news = await admin.firestore().collection(collectionNews)
        .where(fieldNewsDate, "<", now)
        .where(fieldNewsStatus, "==", "pending").get();

    const totalNews = news.docs.length;
    let totalPublished = 0;
    for (const item of news.docs) {
      item.ref.update({[fieldNewsStatus]: "published"});

      const data = item.data();

      const plainText = data.description_plain_text;
      // if the description is too long, truncate it
      const description = plainText.length > 100 ?
            plainText.substring(0, 100) + "..." : plainText;

      const notificationItem = new NotificationItem({
        title: data.title,
        description: description,
        image: data.photo_url,
        data: {
          news_id: item.id,
        },
        type: "2",
        creationDate: new Date(),
      });
      const id = await notificationItem.send();

      if (id) {
        logger.info("Notification sent", id);
        totalPublished++;
      } else {
        logger.error("Error sending notification", {item});
      }
    }

    logger.info("Published news", {totalPublished, totalNews});
    return totalPublished;
  }
}

module.exports = NewsItem;
