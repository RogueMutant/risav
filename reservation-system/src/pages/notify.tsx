import React, { useEffect, useState } from "react";
import "../styles/notify.css";

interface Notification {
  id: string;
  message: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications([
      { id: "1", message: "New reservation request received." },
      { id: "2", message: "Your reservation has been approved." },
    ]);
  }, []);

  return (
    <div className="notifications-container">
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification.id} className="notification">
            {notification.message}
          </div>
        ))
      ) : (
        <p className="no-notifications">No notifications</p>
      )}
    </div>
  );
};

export default Notifications;
