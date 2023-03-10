import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import NavBar from "Scenes/Navbar/NavBar";
import "./Chat.css";
import { useSelector } from "react-redux";
import ConversationWidget from "../Widgets/ConversationWidget";
import { io } from "socket.io-client";
import ChatBox from "Components/Chatbox/ChatBox";
import { userChats } from "Api/ChatRequest";

const Chat = () => {
  const user = useSelector((state) => state.user);
  console.log(user);
  const token = useSelector((state) => state.token);

  const socket = useRef();

  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);

  //Send messages to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  useEffect(() => {
    socket.current = io("http://localhost:8800");
    socket.current.emit("nwe-user-add", user._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
      console.log(onlineUsers, "OnlineUser");
    });
  }, [user]); //eslint-disable-line react-hooks/exhaustive-deps

  //Receive messages from socket server
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      console.log(data);
      setReceivedMessage(data);
    });
  }, []);

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user._id, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user]); //eslint-disable-line react-hooks/exhaustive-deps

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  return (
    <Box>
      <NavBar />
      <Box>
        <div className="Chat">
          {/* Left Side */}
          <div className="Left-side-chat">
            <div className="Chat-container">
              <h2>Chat</h2>
              <div className="Chat-list">
                {chats.map((chat) => (
                  <div
                    onClick={() => {
                      setCurrentChat(chat);
                    }}
                  >
                    <ConversationWidget
                      data={chat}
                      currentUserId={user._id}
                      online={checkOnlineStatus(chat)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right Side */}
          <div className="Right-side-chat">
            <div style={{ width: "20rem", alignSelf: "flex-end" }}></div>
            {/* Chat body */}
            <ChatBox
              chat={currentChat}
              currentUser={user._id}
              setSendMessage={setSendMessage}
              receivedMessage={receivedMessage}
            />
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;
