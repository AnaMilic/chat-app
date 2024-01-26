const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");

router.get("/", (req, res) => {
  res.status(200).json(["chat1", ["ana123", "maja"], "gwebnVLM;"]);
});
module.exports = router;
