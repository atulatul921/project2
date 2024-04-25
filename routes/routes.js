const express = require("express");
const User = require("../models/users");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const bcrypt = require("bcrypt");

const uploader = multer()

const {
  register,
  login,
  verifyToken,
} = require("../controllers/UserController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).single("image");

router.get("/users", async (req, res) => {
  const users = await User.find();
  return res.status(200).json({ status: 200, data: users });
});

router.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
    return res.status(200).json({ status: 200, user: user });
  }
  return res.status(404).json({ status: 404, user: null });
});

router.post("/register", uploader.none() , register);
router.post("/login", login);
router.get("/verifyToken", verifyToken);

router.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const name = req.body.name || null;
  const email = req.body.email || null;
  const username = req.body.username || null;
  let new_image = "";

  const user = await User.findById(userId);

  user.name = name;
  user.email = email;
  user.username = username;

  user.save();

  res.status(200).json({ status: 200, user: user });
});

router.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
    user.deleteOne();
    return res.status(200).json({ status: 200, deletedUser: user });
  } else {
    return res
      .status(404)
      .json({ status: 404, message: "User not found!", deletedUser: null });
  }
});

module.exports = router;
