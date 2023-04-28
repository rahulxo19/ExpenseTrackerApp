const jwt = require("jsonwebtoken");
const User = require("../model/signup");

exports.Auth = async (req, res, next) => {
  try {
    const token = req.header("Auth");
    const userObj = jwt.verify(token, "d037087c3bb218554282");
    console.log(userObj.userId);
    const user = await User.findOne({
        where : {
            id : `${userObj.userId}`
        }
    })
    req.user = user;
    next();
  } catch (err) {
    console.log(err.message + " error in auth");
    res.json({ message: " error in auth " });
  }
};
