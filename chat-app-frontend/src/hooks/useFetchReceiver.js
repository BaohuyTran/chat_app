import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchReceiver = (chat, user) => {
  const [receiver, setReceiver] = useState(null);
  const [error, setError] = useState(null);
  const [receiverId, setReceiverId] = useState(null);

  useEffect(() => {
    setReceiverId(chat?.members.find((id) => id !== user?._id));
  }, [chat, user]);

  useEffect(() => {
    const getUser = async () => {
      if (!receiverId)
        return null;

      const response = await getRequest(`${baseUrl}/users/${receiverId}`);
      if (response.error) {
        return setError(response.error);
      }

      setReceiver(response);
    };

    getUser();
  }, [receiverId]);

  return { receiver, setReceiver };
};