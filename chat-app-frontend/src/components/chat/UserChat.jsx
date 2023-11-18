import avatar from "../../assets/avatar.svg"
import { Stack } from "react-bootstrap";
import { useFetchReceiver } from "../../hooks/useFetchReceiver";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

const UserChat = ({ chat, user }) => {
  const { receiver } = useFetchReceiver(chat, user);
  const { onlineUsers } = useContext(ChatContext);

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
    >
      <div className="d-flex">
        <div className="me-2">
          <img src={avatar} height="35px" />
        </div>
        <div className="text-content">
          <div className="name">{receiver?.name}</div>
          <div className="text">Text Message</div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">10/11/2003</div>
        <div className="this-user-notifications">2</div>
        <div className={
          onlineUsers?.some(user => user?.userId === receiver?._id)
            ? "user-online"
            : ""
        } />
      </div>
    </Stack>
  );
}

export default UserChat;