const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  //res.status(200).json(["ana", "ana123"]);
  /*User.find({})
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(400).json(error));*/

  console.log(req.query);
  const keyword = req.query.search
    ? {
        username: { $regex: req.query.search, $options: "i" },
      }
    : {};

  const users = await User.find(keyword);
  res.send(users);
  console.log(users);
});
router.post("/", (req, res) => {
  console.log(req.body);
  const user = req.body.user;
  const { username } = user;

  User.findOne({ username }).then((dbUser) => {
    if (dbUser) {
      return res.status(400).json("That user already exists.");
    }
    const newUser = new User({ ...user });
    newUser
      .save()
      .then((u) => res.status(200).send(u))
      .catch((err) => res.status(400).send(err));
  });
});
router.post("/login", async (req, res) => {
  console.log(req.body.user.username, req.body.user.password);
  try {
    const username = req.body.user.username;
    const password = req.body.user.password;

    if (!username || !password) {
      return res.status(400).json("Username and password are mandatory fields");
    }
    const user = await User.findOne({ username });
    console.log(user);

    /*if (!user || password !== user.password) {
      return res.status(400).json("User with that data does not exist");
    }*/
    if (user && (await user.matchPassword(password))) {
      return res.status(200).json(user);
    } else {
      return res.status(400).json("User with that data does not exist");
    }
    //return res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
