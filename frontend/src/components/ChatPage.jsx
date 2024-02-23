import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatField from "./ChatField";
import ChatColumn from "./ChatColumn";

function ChatPage() {
  const navigate = useNavigate();
  let [chats, setChats] = useState([]);
  let userId = JSON.parse(localStorage.getItem("user-info"))._id;

  let [selectedChat, setSelectedChat] = useState(null);

  let [messages, setMessages] = useState([]);
  let [newMessage, setNewMessage] = useState("");

  const fetchChats = () => {
    return axios
      .get("http://localhost:5050/api/chats", {
        params: {
          userId: userId,
        },
      })

      .then((response) => {
        console.log(response);
        if (response.data == null) {
          alert("There are no chats");
        } else {
          setChats(response.data);
          if (response.data.length > 0) {
            setSelectedChat(response.data[0]);
          }
          console.log(chats);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Erorr with finding your chats");
      });
  };
  const fetchMessages = async () => {
    if (!selectedChat) return;
    return axios
      .get(`http://localhost:5050/api/messages/${selectedChat._id}`, {})
      .then((response) => {
        console.log(response);
        if (response.data == null) {
          alert("There are no messages");
        } else {
          setMessages(response.data);
          console.log(messages);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Error with finding your messages");
      });
  };

  //console.log(selectedChat);

  useEffect(() => {
    fetchChats();
  }, []);
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  if (chats.length === 0) {
    return null;
  }

  const sendMessage = async (e) => {
    //console.log("mess sendingggg");
    try {
      const reqBody = JSON.stringify({
        messageText: newMessage,
        chatId: selectedChat._id,
        sender: userId,
      });
      console.log(reqBody);
      if (!reqBody) return;
      let res = await fetch("http://localhost:5050/api/messages", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: reqBody,
      });
      const formattedResponse = await res.json();
      console.log(formattedResponse);

      if (res.status === 200) {
        setNewMessage("");
        setMessages([...messages, formattedResponse.data]);
        alert("Message sent");
      } else {
        alert("Sending of message failed " + formattedResponse);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  const typing = (ev) => {
    setNewMessage(ev.target.value);
    //console.log("typinggggg");
    //console.log("new mess:" + newMessage);
  };
  const logout = () => {
    navigate("/");
    localStorage.removeItem("user-info");
  };

  return (
    <div className="chatPage">
      <div className="contactsColumn" style={{ alignSelf: "center" }}>
        <div
          style={{
            textAlign: "center",
            paddingTop: "5px",
            textTransform: "uppercase",
            fontStyle: "italic",
          }}
        >
          My chats
        </div>
        <div>search</div>
        {chats.map((c) => {
          return (
            <ChatField
              chatId={c._id}
              chatName={c.chatName}
              friend={c.chatUsers.filter((u) => u._id !== userId)[0].username}
              lastMessage={c.lastMessage}
              onClick={() => {
                setSelectedChat(c);
              }}
              isActive={c._id === selectedChat?._id}
            />
          );
        })}
      </div>
      <ChatColumn
        chatName={
          selectedChat.chatUsers[0]._id === userId
            ? selectedChat.chatUsers[1].username
            : selectedChat.chatUsers[0].username
        }
        value={newMessage}
        onClick={(e) => sendMessage(e)}
        onChange={(ev) => typing(ev)}
        logout={logout}
        messages={messages}
        user={userId}
      ></ChatColumn>
    </div>
  );
}

export default ChatPage;
