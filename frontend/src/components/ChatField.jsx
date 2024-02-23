import React from "react";

const ChatField = ({
  chatId,
  chatName,
  friend,
  lastMessage,
  onClick,
  isActive,
}) => (
  <div
    className={`chatField`}
    id={chatId}
    onClick={onClick}
    style={{ backgroundColor: isActive ? "white" : "" }}
  >
    <span>name:{chatName}</span> <br />
    <span>friend:{friend}</span> <br />
    <span>mess:{lastMessage}</span> <br />
  </div>
);

export default ChatField;
