import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";

const Chat = () => {
  const authContext = useContext(AuthContext);
  const chatContext = useContext(ChatContext);

  return (
    <Container>
      {chatContext.userChats?.length < 1 ? null :
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {chatContext.isLoading && <p>༼ つ⇧ ◕_◕ ༽つ⇧ Wait a second...</p>}
            {chatContext.userChats?.map((chat, index) => {
              return (
                <div key={index}>
                  <UserChat chat={chat} user={authContext.user} />
                </div>
              )
            })}
          </Stack>
          <p>Chat</p>
        </Stack>
      }
    </Container>
  );
}

export default Chat;