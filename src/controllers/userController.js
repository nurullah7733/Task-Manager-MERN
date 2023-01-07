const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const OtpModel = require("../models/otpModel");
const SendEmailUtility = require("../utility/sendMailConfiguretion");

// Registration
exports.registration = (req, res) => {
  const reqBody = req.body;
  UserModel.create(reqBody, (e, data) => {
    if (e) {
      return res.status(200).json({ status: "fail", data: e });
    }
    return res.status(200).json({ status: "success", data: data });
  });
};

// Login
exports.login = (req, res) => {
  const reqBody = req.body;
  UserModel.aggregate(
    [
      { $match: reqBody },
      {
        $project: {
          _id: 0,
          email: 1,
          firstName: 1,
          lastName: 1,
          mobile: 1,
          photo: 1,
        },
      },
    ],
    (e, data) => {
      if (e) {
        res.status(400).json({ status: "fail", data: e });
      } else {
        if (data.length > 0) {
          let payload = {
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
            data: data[0].email,
          };
          let token = jwt.sign(payload, "SecretKey123456789");
          res
            .status(200)
            .json({ status: "success", token: token, data: data[0] });
        } else {
          res.status(401).json({ status: "unauthorized" });
        }
      }
    }
  );
};

// get profile info
exports.getProfileInfo = (req, res) => {
  let email = req.headers.email;
  UserModel.aggregate(
    [
      { $match: { email: email } },
      {
        $project: {
          _id: 0,
          firstName: 1,
          lastName: 1,
          email: 1,
          mobile: 1,
          photo: 1,
          password: 1,
        },
      },
    ],
    (e, data) => {
      if (e) {
        res.status(400).json({ status: "fail", data: e });
      } else {
        res.status(200).json({ status: "success", data: data });
      }
    }
  );
};

// update profile
exports.profileUpdate = (req, res) => {
  let email = req.headers.email;
  let reqbody = req.body;
  UserModel.updateOne({ email: email }, reqbody, (e, data) => {
    if (e) {
      return res.status(400).json({ status: "fail", data: e });
    } else {
      return res.status(200).json({ status: "success", data: data });
    }
  });
};

// Reset password

// step 01
exports.verifyEmailAndSendOTP = async (req, res) => {
  let OTPCode = Math.floor(100000 + Math.random() * 900000);
  let email = req.params.email;

  try {
    // check user email
    let userCount = await UserModel.aggregate([
      { $match: { email: email } },
      { $count: "total" },
    ]);

    if (userCount.length > 0) {
      // create Otp in database
      let createOTP = await OtpModel.create({ email: email, otp: OTPCode });
      // send Email to user mail
      let sendMail = await SendEmailUtility(
        email,
        `Your Verify Code is = ${OTPCode}`,
        "Task Manager PIN Verify"
      );
      res.status(200).json({ status: "success", data: sendMail });
    } else {
      res.status(400).json({ status: "fail", data: "Email Not Found" });
    }
  } catch (e) {
    res.status(400).json({ status: "fail", data: e });
  }
};

// step 02
exports.verifyOTP = async (req, res) => {
  let email = req.params.email;
  let otp = req.params.otp;

  try {
    let otpCount = await OtpModel.aggregate([
      { $match: { email: email, otp: otp, status: 0 } },
      { $count: "total" },
    ]);

    if (otpCount.length > 0) {
      let otpUpdate = await OtpModel.updateOne(
        { email: email, otp: otp, status: 0 },
        { status: 1 }
      );

      res.status(200).json({ status: "success", data: otpUpdate });
    } else {
      res.status(400).json({ status: "fail", data: "Invalid OTP" });
    }
  } catch (error) {
    res.status(400).json({ status: "fail", data: e });
  }
};

// step 03
exports.resetPassword = (req, res) => {
  let email = req.body.email;
  let otpCode = req.body.otpCode;
  let newPassword = req.body.password;

  OtpModel.aggregate(
    [
      { $match: { email: email, otp: otpCode, status: 1 } },
      { $count: "total" },
    ],
    (e, data) => {
      if (e) {
        res.status(400).json({ status: "fail", data: e });
      } else {
        if (data.length > 0) {
          UserModel.updateOne(
            { email: email },
            { password: newPassword },
            (e, data) => {
              if (e) {
                res
                  .status(200)
                  .json({ status: "fail", data: "Password reset fail" });
              } else {
                res.status(200).json({ status: "success", data: data });
              }
            }
          );
        } else {
          res.status(400).json({
            status: "fail",
            data: "Something went wrong. Please try again",
          });
        }
      }
    }
  );
};
