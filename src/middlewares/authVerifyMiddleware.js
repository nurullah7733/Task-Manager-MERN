const jwt = require("jsonwebtoken");

exports.authVerify = (req, res, next) => {
  let token = req.headers["token"];
  jwt.verify(token, "SecretKey123456789", (err, decode) => {
    if (err) {
      return res.status(401).json({ status: "unauthorized" });
    } else {
      let email = decode.data;
      req.headers.email = email;
      next();
    }
  });
};
