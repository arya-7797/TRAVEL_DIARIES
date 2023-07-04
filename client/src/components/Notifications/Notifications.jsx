import React, { useEffect, useState } from "react";
import axios from "utils/axios";
import { setUser } from "../../state/index";
import { useDispatch, useSelector } from "react-redux";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const currentUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const markNotificationAsRead = async () => {
    try {
      const response = await axios.patch(`/make-seen/${currentUser._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getNotifications = async () => {
    try {
      const response = await axios.get(`getnotifications/${currentUser._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("jjjjjj ", response);
      setNotifications(response.data);
      console.log("response", response);
    } catch (error) {
      console.error("getNotification error:", error);
    }
  };

  useEffect(() => {
    getNotifications();
    const interval = setInterval(() => {
      markNotificationAsRead();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications found</p>
      ) : (
        <ul>
          {notifications?.map((notification) => (
            <li
              key={notification._id}
              style={{ fontWeight: notification.read ? "normal" : "bold" }}
            >
              {notification.notificationMessage}
              {!notification.read && (
                <button
                  onClick={() => markNotificationAsRead(notification._id)}
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
