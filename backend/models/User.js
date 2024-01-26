const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please provide username"],
    trim: true,
    minLength: 5,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    trim: true,
    minLength: 8,
  },
});
module.exports = User = mongoose.model("users", UserSchema);
