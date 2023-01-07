const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    status: String,
    email: String,
    createdDate: { type: Date, default: Date.now() },
  },
  { versionKey: false }
);

const TaskModel = mongoose.model("tasks", taskSchema);
module.exports = TaskModel;
