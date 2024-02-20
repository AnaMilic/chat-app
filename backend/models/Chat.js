const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");

const ChatSchema = new Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    chatUsers: [
      {
        type: mongoose.Types.ObjectId,
        ref: User,
      },
    ],
    /*lastMessage: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },*/
    lastMessage: {
      type: String,
    },
  }
  // { timestamps: true }
);
module.exports = Chat = mongoose.model("chats", ChatSchema);
