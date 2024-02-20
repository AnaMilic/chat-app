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
  .connect("mongodb+srv://admin:admin@cluster0.1b64ygn.mongodb.net/", {
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
