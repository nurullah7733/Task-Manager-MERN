const express = require("express");
const router = express.Router();

const {
  createTask,
  deleteTask,
  updateTaskStatus,
  getTaskByStatus,
  taskSummary,
} = require("../controllers/taskController");
const {
  registration,
  login,
  profileUpdate,
  getProfileInfo,
  verifyEmailAndSendOTP,
  verifyOTP,
  resetPassword,
} = require("../controllers/userController");

const { authVerify } = require("../middlewares/authVerifyMiddleware");

// User Router
router.post("/registration", registration);
router.post("/login", login);
router.post("/profile-update", authVerify, profileUpdate);
router.get("/profile-info", authVerify, getProfileInfo);
router.get("/forget-password/:email", verifyEmailAndSendOTP);
router.get("/verify-otp/:email/:otp", verifyOTP);
router.post("/reset-password", resetPassword);

// Task Router
router.post("/create", authVerify, createTask);
router.get("/delete/:id", authVerify, deleteTask);
router.get("/task-status-update/:id/:status", authVerify, updateTaskStatus);
router.get("/:status/task", authVerify, getTaskByStatus);
router.get("/total-task", authVerify, taskSummary);

module.exports = router;
