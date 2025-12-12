import { useState, useEffect } from 'react';
import { useFinance } from '../contexts/FinanceContext';

function NotificationCenter() {
  const { notifications, markNotificationRead } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate unread notifications count
  useEffect(() => {
    const count = notifications.filter(notif => !notif.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Handle marking a notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notif => !notif.read);
      
      // Mark each unread notification as read
      for (const notif of unreadNotifications) {
        await markNotificationRead(notif.id);
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Get notification icon based on type and importance
  const getNotificationIcon = (notification) => {
    const { type, importance } = notification;
    
    // Default icon
    let icon = '📣';
    
    // Icons based on type
    if (type.includes('budget')) {
      icon = '💰';
    } else if (type.includes('goal')) {
      icon = '🎯';
    } else if (type.includes('income')) {
      icon = '💵';
    } else if (type.includes('settings')) {
      icon = '⚙️';
    }
    
    // Override based on importance
    if (importance === 'warning') {
      icon = '⚠️';
    } else if (importance === 'alert') {
      icon = '🚨';
    } else if (importance === 'success') {
      icon = '✅';
    }
    
    return icon;
  };

  // Get notification color based on importance
  const getNotificationColor = (importance) => {
    switch (importance) {
      case 'success':
        return 'bg-green-100 border-green-400';
      case 'warning':
        return 'bg-yellow-100 border-yellow-400';
      case 'alert':
        return 'bg-red-100 border-red-400';
      case 'info':
      default:
        return 'bg-blue-100 border-blue-400';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
        aria-label="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
          <div className="p-3 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-gray-100 ${!notification.read ? 'bg-gray-50' : ''}`}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getNotificationColor(notification.importance)}`}>
                          <span>{getNotificationIcon(notification)}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="mt-2 text-xs text-indigo-600 hover:text-indigo-800"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            )}
          </div>
          
          <div className="p-2 border-t border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-800 py-1"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
