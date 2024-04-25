const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "THE ONE PIECE IS REAL!";

const register = async (req, res) => {
  const { name, email, username, password } = req.body;

  console.log(password)

  if (name && email && username && password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        user: user,
        admin: true,
      },
      SECRET_KEY,
      {
        expiresIn: "72h", // expires in 72 hours
      }
    );
    return res.status(201).json({
      status: 201,
      submittedUser: user.toJSON(),
      token: token,
    });
  }
  return res.status(400).json({
    status: 400,
    submittedUser: null,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    return res.status(500).json({
      status: 500,
      message: "User not found!",
      user: null,
      token: null,
    });
  }
  const matchPassword = await bcrypt.compare(password, existingUser.password);
  if (!matchPassword)
    return res.status(500).json({
      status: 500,
      message: "Credentials doen't match!",
      user: null,
      token: null,
    });

  const token = jwt.sign(
    {
      user: existingUser,
      admin: true,
    },
    SECRET_KEY,
    {
      expiresIn: "72h", // expires in 72 hours
    }
  );
  return res.status(200).json({
    status: 200,
    authenticatedUser: existingUser.toJSON(),
    token: token,
  });
};

const verifyToken = (req, res) => {
  let token = req.headers.authorization;
  try {
    if (token) {
      token = token.split(" ")[1];
      const user = jwt.verify(token, SECRET_KEY);
      if (user) {
        req.userId = user.user._id;
        return res.status(200).json({
          status: 200,
          message: "Token verified!",
          tokenVerified: true,
          user,
          token,
        });
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

module.exports = { register, login, verifyToken };
