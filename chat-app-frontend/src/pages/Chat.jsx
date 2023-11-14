import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const chatContext = useContext(ChatContext);

  console.log("User's chat:", chatContext.userChats);
  return (<>Chat</>);
}

export default Chat;