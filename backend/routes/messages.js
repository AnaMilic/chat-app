const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.get("/", (req, res) => {
  res.status(200).json(["ana", "wgebignoqr", "chat1"]);
});
module.exports = router;
