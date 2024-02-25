const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const users = require("./routes/users");
const chats = require("./routes/chats");
const messages = require("./routes/messages");

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5050;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

app.use("/api/users", users);
app.use("/api/chats", chats);
app.use("/api/messages", messages);

app.get("/", (req, res) => {
  res.send("Server is running");
});
const server = app.listen(5050, () => {
  console.log(`Backend is running on port 5050`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData);
    console.log(userData);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room:" + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("end typing", (room) => {
    socket.in(room).emit("end typing");
  });

  socket.on("new message", (newMessageReceived) => {
    console.log(newMessageReceived.chat);
    var chat = newMessageReceived.chat;
    if (!chat.chatUsers) return console.log("chatUsers aren't defined");

    chat.chatUsers.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("User disconnected");
    socket.leave(userData._id);
  });
});
