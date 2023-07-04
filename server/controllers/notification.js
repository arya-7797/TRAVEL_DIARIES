import NotificationModel from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    console.log("111");
    const notificationFor = req.params.id;
    console.log(notificationFor);
    const notifications = await NotificationModel.find({
      notificationFor: Object(notificationFor),
    })
      .populate("notificationBy", "_id  firstName  picturePath")
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500);
  }
};


export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = Object(req.params.id);
    const notification = await NotificationModel.updateMany(
      { notificationFor: userId },
      { $set: { read: true } }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
