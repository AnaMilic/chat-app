import React from "react";
import ScrollableFeed from "react-scrollable-feed";

const ChatColumn = ({
  chatName,
  onClick,
  onChange,
  value,
  logout,
  messages,
  user,
}) => (
  <div className="openedChatColumn">
    <div
      style={{
        textAlign: "center",
        paddingTop: "5px",
        textTransform: "uppercase",
        fontStyle: "italic",
        height: "5vh",
      }}
    >
      name :{chatName}
      <button
        style={{
          backgroundColor: "blueviolet",
          height: "20px",
          width: "100px",
          display: "block",
          position: "absolute",
          top: "0",
          right: "0",
          padding: "0px",
          borderRadius: "10px",
        }}
        onClick={logout}
      >
        Logout <i className="fa-solid fa-right-from-bracket"></i>
      </button>
    </div>
    <div className="messages" style={{ height: "83vh" }}>
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => (
            <div style={{ display: "flex" }} key={m._id}>
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user ? "white" : "#B9F5D0"
                  }`,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: `${m.sender._id === user ? "auto" : "0"}`,
                  marginTop: "2px",
                  marginBottom: "2px",
                }}
              >
                {m.messageText}
              </span>
            </div>
          ))}
      </ScrollableFeed>
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        margin: "5px",
        position: "absolute",
        bottom: "0",
        left: "0",
        right: "0",
        height: "10vh",
      }}
    >
      <input
        type="text"
        placeholder="Type your message here"
        value={value}
        style={{
          border: "none",
          width: "300px",
          height: "50px",
          borderRadius: "3px",
          marginRight: "0px",
          flex: "80%",
        }}
        onChange={onChange}
      ></input>
      <button
        className="btnSendMsg"
        style={{
          width: "100px",
          backgroundColor: "blueviolet",
          flex: "20%",
        }}
        onClick={onClick}
        disabled={value === ""}
      >
        Send <i className="fa-solid fa-location-arrow"></i>
      </button>
    </div>
  </div>
);

export default ChatColumn;
