import React, { Fragment, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatField from "./ChatField";
import ChatColumn from "./ChatColumn";
import io from "socket.io-client";
import SearchModal from "./SearchModal";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
import Effect from "react-notification-badge/lib/components/Effect";

const ENDPOINT = "http://localhost:5050";
var socket, selectedChatCompare;

function ChatPage() {
  const navigate = useNavigate();
  let [chats, setChats] = useState([]);
  let userId = JSON.parse(localStorage.getItem("user-info"))._id;
  let [selectedChat, setSelectedChat] = useState(null);
  let [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isNewMessagesDropdownVisible, setIsNewMessagesDropdownVisible] =
    useState(false);

  const chatColumnRef = useRef(null);

  const [socketConnected, setSocketConnected] = useState(false);
  const [typingState, setTypingState] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);

  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const searchModalRef = useRef(null);

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
          socket.emit("join chat", selectedChat._id);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Error with finding your messages");
      });
  };
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userId);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("end typing", () => setIsTyping(false));
  }, []);

  const sendMessage = async (e) => {
    socket.emit("end typing", selectedChat._id);
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

      if (res.status === 200) {
        setNewMessage("");
        socket.emit("new message", formattedResponse);
        setMessages([...messages, formattedResponse]);
        /*chatColumnRef.current.lastElementChild.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });*/
      } else {
        alert("Sending of message failed " + formattedResponse);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      // console.log(newMessageReceived);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        //salje se obavestenje jer sam u ovom slucaju u jednom cetu, tj jedan mi je otvoren a poruka stize na drugi
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
        }
      } else {
        flushSync(() => {
          setMessages([...messages, newMessageReceived]);
        });
        console.log({ chatColumnRef });
        chatColumnRef.current.lastElementChild.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    });
  });

  useEffect(() => {
    function outsideModalClick(ev) {
      if (!searchModalRef.current?.contains(ev.target) && searchModalVisible) {
        setSearchModalVisible(false);
      }
    }
    window.addEventListener("click", outsideModalClick);
    return () => {
      window.removeEventListener("click", outsideModalClick);
    };
  }, []);

  if (chats.length === 0) {
    return null;
  }

  const typing = (ev) => {
    setNewMessage(ev.target.value);
    if (!socketConnected) return;
    if (!typingState) {
      setTypingState(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timer = 5000;
    setTimeout(() => {
      let currentTime = new Date().getTime();
      let timeDifference = currentTime - lastTypingTime;
      if (timeDifference >= timer && typingState) {
        socket.emit("end typing", selectedChat._id);
        setTypingState(false);
      }
    }, timer);
  };
  const logout = () => {
    navigate("/");
    localStorage.removeItem("user-info");
  };

  const fetchUsers = () => {
    console.log("searching");
    axios.get("http://localhost:5050/api/users").then((res) => {
      setUsers(res.data);
      console.log(users);
    });
    let searchedUsr = users.filter((u) => u.username.includes(searchValue));
    console.log(searchedUsr);
    setSearchedUsers(searchedUsr);
    console.log(searchedUsers);
    return searchedUsr;
  };

  const renderNewMessages = () => (
    <Fragment>
      <div
        style={{
          textAlign: "center",
          paddingTop: "5px",
          textTransform: "uppercase",
          fontStyle: "italic",
          position: "relative",
        }}
      >
        My chats{" "}
        <button
          className="notifBtn"
          onClick={() => setIsNewMessagesDropdownVisible((p) => !p)}
        >
          <i className="fa-solid fa-comment" />
          <NotificationBadge
            count={notification.length}
            effect={Effect.SCALE}
            style={{
              padding: "2px 4px",
              top: "-15px",
              left: "-5px",
              right: "none",
            }}
          />
        </button>
        {isNewMessagesDropdownVisible && (
          <div className="notifList">
            {!notification.length && <p>You don't have new messages.</p>}
            {notification.map((notif) => (
              <p
                className="notifItem"
                key={notif._id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((not) => not !== notif));
                }}
              >{`New message from user ${notif.sender.username}.`}</p>
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );

  return (
    <div className="chatPage">
      <div className="contactsColumn" style={{ alignSelf: "center" }}>
        {renderNewMessages()}
        <button
          className="searchUsersBtn"
          onClick={() => {
            setSearchModalVisible(true);
          }}
        >
          search users
        </button>
        {searchModalVisible && (
          <SearchModal
            setSearchModalVisible={setSearchModalVisible}
            value={searchValue}
            search={() => {
              fetchUsers();
            }}
            onChange={(e) => setSearchValue(e.target.value)}
            users={searchedUsers}
            ref={searchModalRef}
          />
        )}
        {chats.map((c) => {
          return (
            <ChatField
              key={c._id}
              chatId={c._id}
              chatName={c.chatName}
              friend={c.chatUsers.filter((u) => u._id !== userId)[0].username}
              lastMessage={c.lastMessage}
              onClick={() => {
                setSelectedChat(c);
              }}
              isActive={c._id === selectedChat?._id}
              //notif={notification.includes()}
            />
          );
        })}
      </div>
      <ChatColumn
        ref={chatColumnRef}
        chatName={
          selectedChat.chatUsers[0]._id === userId
            ? selectedChat.chatUsers[1].username
            : selectedChat.chatUsers[0].username
        }
        value={newMessage}
        onClick={(e) => sendMessage(e)}
        isTyping={isTyping}
        onChange={(ev) => typing(ev)}
        logout={logout}
        messages={messages}
        user={userId}
      ></ChatColumn>
    </div>
  );
}

export default ChatPage;
