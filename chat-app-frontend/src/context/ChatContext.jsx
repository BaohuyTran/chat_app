import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

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

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, [])

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
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}