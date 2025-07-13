import { useProjectStore } from '../store/projectStore';
import { Notification } from '@interface/common';

export const useNotifications = (userId: string) => {
  const store = useProjectStore();

  const sendNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    store.sendNotificationToUser(userId, newNotification);
    return newNotification;
  };

  const markAsRead = (notificationId: string) => {
    store.markNotificationAsRead(notificationId);
  };

  const getUserNotifications = () => {
    return store.getUserNotifications(userId);
  };

  return {
    notifications: getUserNotifications(),
    sendNotification,
    markAsRead,
  };
};
