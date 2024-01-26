const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema(
  {
    chatName: {
      type: String,

      trim: true,
    },
    /*isGroupChat:{
    type:Boolean,
    default:false
  },*/
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);
module.exports = Chat = mongoose.model("chats", ChatSchema);
