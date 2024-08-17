const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

const collectionNotification = "clean_notifications";

const fieldNotificationTitle = "title";
const fieldNotificationDescription = "description";
const fieldNotificationImage = "image";
const fieldNotificationData = "data";
const fieldNotificationType = "type";
const fieldNotificationCreationDate = "creation_date";

const fieldNotificationGlobalTopic = "global";

/**
 * Represents a notification item.
 * @class
 */
class NotificationItem {
  /**
     * Creates a new instance of the NotificationItem class.
     * @constructor
     * @param {string} title - The title of the notification.
     * @param {string} description - The description of the notification.
     * @param {string} image - The image of the notification.
     * @param {string} data - The data of the notification.
     * @param {string} type - The type of the notification.
     * @param {string} creationDate - The creation date of the notification.
     */
  constructor({title, description, image, data, type, creationDate}) {
    this.title = title;
    this.description = description;
    this.image = image;
    this.data = data;
    this.type = type;
    this.creationDate = creationDate;
  }

  /**
   * Get notificationobject from map
   * @param {*} map - The map of the notification.
   * @return {NotificationItem} - The notification object.
   */
  static fromMap(map) {
    return new NotificationItem({
      title: map[fieldNotificationTitle],
      description: map[fieldNotificationDescription],
      image: map[fieldNotificationImage],
      data: map[fieldNotificationData],
      type: map[fieldNotificationType],
      creationDate: map[fieldNotificationCreationDate],
    });
  }

  /**
     * Get notification object map
     * @return {*} - The map of the notification.
     */
  toMap() {
    const map = {};
    map[fieldNotificationTitle] = this.title;
    map[fieldNotificationDescription] = this.description;
    map[fieldNotificationImage] = this.image;
    map[fieldNotificationData] = this.data;
    map[fieldNotificationType] = this.type;
    map[fieldNotificationCreationDate] = this.creationDate;
    return map;
  }

  /**
   * Save the notification to the database.
   * @return {Promise} The promise of the save operation.
   * */
  save() {
    return admin.firestore().collection(collectionNotification)
        .add(this.toMap());
  }

  /**
 * Send notification to all users from the global topic
 * @return {string|null} - The notification id.
 */
  async send() {
    let notificationArgument = {
      "click_action": "FLUTTER_NOTIFICATION_CLICK",
      [fieldNotificationImage]: this.image?this.image:"",
    };
    // add data.arguments to notificationArgument
    if (this.data) {
      notificationArgument = Object.assign(notificationArgument, this.data);
    }

    const countBadge = 1;

    let androidNotiifcation = {};
    if (this.image != null && this.image != "") {
      androidNotiifcation = {
        "imageUrl": this.image,
      };
    }

    const message = {
      topic: fieldNotificationGlobalTopic,
      data: notificationArgument,
      notification: {
        title: this.title,
        body: this.description,
      },
      android: {
        notification: androidNotiifcation,
      },
      apns: {
        payload: {
          aps: {
            "sound": "default",
            "badge": countBadge,
            "content-available": true,
          },
        },
        fcm_options: {
          image: this.image,
        },
      },
    };

    if (this.image != null && this.image != "") {
      message.notification.image = this.image;
    }

    let notificationId = "";
    try {
      const response = await admin.messaging().send(message);
      notificationId = response;
      logger.info("Successfully sent notification ", {response});

      return notificationId;
    } catch (error) {
      logger.error("Error sending notification ", {error});
      return null;
    }
  }
}

module.exports = NotificationItem;
