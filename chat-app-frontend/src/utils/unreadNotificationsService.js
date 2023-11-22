export const unreadNotificationsService = (notifications) => {
  return notifications.filter((n) => n.isRead === false);
}