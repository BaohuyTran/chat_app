export const sortChatsByLastMessageService = (firstChat, secondChat) => {
  console.log('firstChat', firstChat);
  return new Date(secondChat.updatedAt) - new Date(firstChat.updatedAt);
}