const express = require("express");
const app = new express();
const router = require("./src/routes/api");
const bodyParser = require("body-parser");

// Security Middleware bib Import
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const hpp = require("hpp");
const xss = require("xss-clean");
const cors = require("cors");

// Database Lib Import
const mongoose = require("mongoose");

// Security Middleware Implement
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// request limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

// Body Parser Implement
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// Request Rate Limit
const limiter = rateLimit({ windowMs: 15 * 60 * 100, max: 3000 });
app.use(limiter);

// Mongo DB Database Connection
let URI = "mongodb://127.0.0.1:27017/todo";
let atlusUrl = process.env.ATLUS_URL;
let OPTION = { user: "nur", pass: process.env.DB_PASSWORD, autoIndex: true };
mongoose.connect(atlusUrl, OPTION, (e) => {
  console.log("Connection Success");
  console.log(e);
});

// Routing Implement
app.use("/", router);

// undefiend Route Implement
app.use("*", (req, res) => {
  res.status(404).json({ status: "fail", data: "Not Found" });
});

module.exports = app;
