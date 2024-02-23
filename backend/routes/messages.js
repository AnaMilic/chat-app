const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const User = require("../models/User");

router.get("/:chatId", async (req, res) => {
  //res.status(200).json(["ana", "wgebignoqr", "chat1"]);
  try {
    const chatId = req.params.chatId;
    console.log({ chatId });
    const messages = await Message.find({
      chat: chatId,
    })
      .populate("sender")
      .populate("chat")
      .exec();

    console.log({ messages });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.post("/", async (req, res) => {
  const chatId = req.body.chatId;
  const messageText = req.body.messageText;
  if (!chatId || !messageText) {
    return res.status(400).json("Invalid data for chat");
  }
  let newMessage = new Message({
    sender: req.body.sender,
    messageText: messageText,
    chat: chatId,
  });
  newMessage = await newMessage.populate("sender");
  newMessage = await newMessage.populate("chat");
  newMessage = await User.populate(newMessage, {
    path: "chat.chatUsers",
    select: "username",
  });
  //+ treba da dodam update lastMessage, kad je povezem sa modelom message
  newMessage
    .save()
    .then((mess) => res.status(200).send(mess))
    .catch((err) => res.status(400).send(err));
});
module.exports = router;
