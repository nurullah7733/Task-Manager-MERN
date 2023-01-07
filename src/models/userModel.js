const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    mobile: String,
    photo: String,
    createdDate: { type: Date, default: Date.now() },
  },
  { versionKey: false }
);

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
