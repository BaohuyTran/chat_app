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

  // receive message
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((messages) => [...messages, res]);
    })

    return (() => {
      socket.off("getMessage");
    })
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
  }, [user]);

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
        onlineUsers
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}