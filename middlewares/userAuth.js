const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "THE ONE PIECE IS REAL!";

const auth = (req, res, next) => {
  let token = req.headers.authorization;
  try {
    if (token) {
      token = token.split(" ")[1];
      console.log(token);
      const user = jwt.verify(token, SECRET_KEY);
      if (user) {
        req.userId = user.id;
        next();
      } else
        return res.status(401).json({
          status: 401,
          message: "No Information found!",
          tokenVerified: false,
          token,
        });
    } else {
      return res.status(401).json({
        status: 401,
        message: "Token not found, please provide a token in the headers!",
        tokenVerified: false,
        token: token,
      });
    }
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: error.message,
      tokenVerified: false,
      token: token,
    });
  }
};

module.exports = auth;
