import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);

  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);

  const [newMessage, setNewMessage] = useState(null);
  const [newMessageError, setNewMessageError] = useState(null);

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Initial socket
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return (() => { newSocket.disconnect() });
  }, [user]);

  // add online user
  useEffect(() => {
    if (socket === null) return;

    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    })

    return (() => {
      socket.off("getOnlineUsers");
    });
  }, [socket]);

  // send message
  useEffect(() => {
    if (socket === null) return;

    const receiverId = currentChat?.members.find((id) => id !== user?._id);
    socket.emit("sendMessage", { ...newMessage, receiverId });
  }, [newMessage]);

  // receive message and notifications
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((messages) => [...messages, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

      if (isChatOpen) {
        setNotifications((notifis) => [{ ...res, isRead: true }, ...notifis]);
      } else {
        setNotifications((notifis) => [res, ...notifis]);
      }
    });

    return (() => {
      socket.off("getMessage");
      socket.off("getNotification");
    });
  }, [socket, currentChat]);

  // Get potential users
  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);
      if (response.error) {
        return console.log("Error fetching users", response);
      }

      const pChats = response.filter((u) => {
        let isChatCreated = false;

        if (user?._id === u._id) return false;
        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }

        return !isChatCreated;
      });

      setPotentialChats(pChats);
      setAllUsers(response);
    }

    getUsers();
  }, [userChats])

  // get all chats of the user
  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

        setIsUserChatsLoading(false);

        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);
      }
    }

    getUserChats();
  }, [user, notifications]);

  // create a new conservation
  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(`
      ${baseUrl}/chats`,
      JSON.stringify({ firstId, secondId })
    );

    if (response.error) {
      return console.log("Error creating chat", response);
    }

    setUserChats((chats) => [...chats, response]);
  }, []);

  // get the conservation
  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, [])

  // get all messages from the current chat
  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);

      const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);

      setIsMessagesLoading(false);

      if (response.error) {
        setMessagesError(response.error);
      }

      setMessages(response);
    };

    getMessages();
  }, [currentChat]);

  // send message
  const sendMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
    if (!textMessage) return;

    const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
      chatId: currentChatId,
      senderId: sender._id,
      text: textMessage
    }));

    if (response.error) {
      return setNewMessageError(response);
    }

    setNewMessage(response);
    setMessages((messages) => [...messages, response]);
    setTextMessage("");
  }, [])

  // Mark all notifications as read
  const markAllNotificationsAsRead = useCallback((notifications) => {
    const modifiedNotifications = notifications.map((notification) => {
      return {
        ...notification,
        isRead: true
      }
    });

    setNotifications(modifiedNotifications);
  }, []);

  // Mark one notification as read
  const markOneNotificationAsRead = useCallback((notification, userChats, user, notifications) => {
    // find the notification's chat
    const targetChat = userChats.find((chat) => {
      const chatMembers = [user._id, notification.senderId];
      const isTargetChat = chat?.members.every((member) => {
        return chatMembers.includes(member);
      });

      return isTargetChat;
    });

    // mark the notification as read
    const modifiedNotifications = notifications.map((n) => {
      if (notification.senderId === n.senderId) {
        return { ...notification, isRead: true };
      } else {
        return n;
      }
    });

    updateCurrentChat(targetChat);
    setNotifications(modifiedNotifications);

  }, []);

  // Mark all notifications of this chatting user
  const markThisUserNotificationsAsRead = useCallback((thisUserNotifications, notifications) => {
    const modifiedNotifications = notifications.map((notification) => {
      let result;

      thisUserNotifications.forEach((n) => {
        if (n.senderId === notification.senderId) {
          result = { ...n, isRead: true };
          console.log('true', result);
        } else {
          result = notification;
          console.log('false', result);
        }
      });

      return result;
    });

    setNotifications(modifiedNotifications);
  })

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        setPotentialChats,
        currentChat,
        setCurrentChat,
        createChat,
        updateCurrentChat,
        messages,
        setMessages,
        isMessagesLoading,
        sendMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markOneNotificationAsRead,
        markThisUserNotificationsAsRead
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}