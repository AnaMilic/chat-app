const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");
const Chat = require("./Chat");

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
    messageText: {
      type: String,

      trim: true,
    },
    chat: {
      type: mongoose.Types.ObjectId,
      ref: Chat,
    },
  }
  /* {
    timestamps: true,
  }*/
);
module.exports = Message = mongoose.model("messages", MessageSchema);
