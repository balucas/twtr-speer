const jwt = require("jsonwebtoken");
const config = require("./config.js");

const checkToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Invalid token"
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: "No token"
    });
  }
};

module.exports = {
  checkToken: checkToken
}