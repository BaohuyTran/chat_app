import { createContext, useState, useEffect } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsLoading(true);
        setError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

        setIsLoading(false);

        if (response.error) {
          return setError(response);
        }

        setUserChats(response);
      }
    }

    getUserChats();
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isLoading,
        error
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}