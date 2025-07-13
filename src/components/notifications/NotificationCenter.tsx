import React from 'react';
import { useProjectStore } from '../../store/projectStore';
import { 
  Bell,
  MessageSquare,
  Clock,
  AlertCircle,
  User,
  Check
} from 'lucide-react';
import { NotificationType } from '../../types';

export function NotificationCenter() {
  const notifications = useProjectStore((state) => state.getUserNotifications('current-user')); // TODO: Get from auth context
  const markNotificationAsRead = useProjectStore((state) => state.markNotificationAsRead);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'Task':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'Deadline':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Mention':
        return <User className="h-5 w-5 text-purple-500" />;
      case 'System':
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {notification.title}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {notification.message}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </div>
            </div>
            {!notification.read && (
              <button
                onClick={() => markNotificationAsRead(notification.id)}
                className="flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <Check className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}