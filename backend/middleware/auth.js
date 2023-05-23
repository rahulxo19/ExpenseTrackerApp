const jwt = require("jsonwebtoken");
const User = require("../model/signup");
const mongoose = require("mongoose");

exports.Auth = async (req, res, next) => {
  try {
    const token = req.header("Auth");
    const userObj = jwt.verify(token, "d037087c3bb218554282");
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(userObj.userId),
    });
    req.user = user;
    next();
  } catch (err) {
    console.log(err.message + " error in auth");
    res.json({ message: " error in auth " });
  }
};
