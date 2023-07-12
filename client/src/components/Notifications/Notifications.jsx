import React, { useEffect, useState } from "react";
import axios from "utils/axios";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const currentUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const getNotifications = async () => {
    try {
      const response = await axios.get(`notification/getnotifications/${currentUser._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(response.data);
    } catch (error) {
      console.error("getNotification error:", error);
    }
  };

  useEffect(() => {
    getNotifications();
    const interval = setInterval(() => {
      getNotifications();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2 className="page-title">Notifications</h2>
        {notifications.length === 0 ? (
          <p>No notifications found</p>
        ) : (
          <ul className="notification-list">
            {notifications?.map((notification) => (
              <li
                key={notification._id}
                className={`notification-item ${notification.read ? "" : "unread"}`}
              >
                {notification.notificationMessage}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
