import React, { useState, useEffect } from 'react';
import './Notification.css';
import { IoNotificationsSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  // Fetch notifications from backend
  useEffect(() => {
    fetch('/api/notification')
      .then(res => res.json())
      .then(data => {
        setNotifications(data);
        setUnreadCount(data.length); // All fetched are initially unread
      })
      .catch(err => console.error('Error fetching notifications:', err));
  }, []);

  const handleNotificationClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      setUnreadCount(0);
    }
  };

  const openDialog = (notification) => {
    setSelectedNotification(notification);
    setShowDialog(true);
  };

  const handleAccept = () => {
  setShowDialog(false);
  const role = localStorage.getItem('role');

  if (role === 'ngo') {
    navigate('/track-donation-receiver');
  } else if (role === 'restaurant') {
    navigate('/track-donation-donor');
  } else {
    navigate('/');
  }
};

const handleReject = () => {
  setShowDialog(false);
  const role = localStorage.getItem('role');

  if (role === 'ngo') {
    navigate('/ngo-dashboard/*');
  } else if (role === 'restaurant') {
    navigate('/restaurant-dashboard');
  } else {
    navigate('/dashboard');
  }
};


  return (
    <div className="notification-container">
      {/* Notification Icon */}
      <div className="notification-icon" onClick={handleNotificationClick}>
        <IoNotificationsSharp />
        {unreadCount > 0 && (
          <div className="notification-dot"></div>
        )}
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="notification-dropdown open">
          <h4>Notifications</h4>
          <ul>
            {notifications.map((notification) => (
              <li key={notification._id} onClick={() => openDialog(notification)}>
                {notification.name} ({notification.type}) has requested a donation.
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Dialog box */}
      {showDialog && selectedNotification && (
        <div className="dialog-box">
          <p>
            <strong>{selectedNotification.name}</strong> ({selectedNotification.type}) has sent a donation request.
          </p>
          <div className="dialog-buttons">
            <button onClick={handleAccept}>Accept</button>
            <button onClick={handleReject}>Reject</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notification;
