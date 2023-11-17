import { Stack } from "react-bootstrap";
import moment from "moment";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { useFetchReceiver } from "../../hooks/useFetchReceiver";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const { currentChat, messages, isMessagesLoading } = useContext(ChatContext);
  const { receiver } = useFetchReceiver(currentChat, user);

  console.log(messages);

  if (!receiver) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        ༼ つ⇧ ◕_◕ ༽つ⇧ No conversation selected...
      </p>
    )
  }

  if (isMessagesLoading) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        ༼ つ⇧ ◕_◕ ༽つ⇧ Wait a second!...
      </p>
    )
  }

  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <strong>{receiver?.name}</strong>
      </div>
      <Stack gap={3} className="messages">
        {messages && messages.map((message, index) => (
          <Stack
            key={index}
            className={`${message?.senderId === user?._id
              ? "message self align-self-end flex-grow-0"
              : "message align-self-start flex-grow-0"
              }`}
          >
            <span>{message.text}</span>
            <span className="message-footer">{moment(message.createdAt).calendar()}</span>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default ChatBox;