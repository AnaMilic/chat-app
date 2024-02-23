const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const User = require("../models/User");

router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const dbUser = await User.findOne({ _id: userId });
  Chat.find({ chatUsers: { $in: [dbUser._id] } })

    .exec()
    .then(async (chats) => {
      if (!chats) {
        return res.status(400).json("User doesn not have any chat");
      }
      const allUsers = await User.find();
      const formattedChats = chats.map((chat) => {
        const filteredUsers = allUsers.filter((u) =>
          chat.chatUsers.includes(u._id)
        );
        return {
          chatName: chat.chatName,
          lastMessage: chat.lastMessage,
          _id: chat._id,
          chatUsers: [...filteredUsers],
        };
      });
      console.log({ formattedChats });
      return res.status(200).json(formattedChats);
    })
    .catch((err) => res.status(400).json(err));
});

module.exports = router;
