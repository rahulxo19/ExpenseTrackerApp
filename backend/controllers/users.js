const bcrypt = require("bcrypt");
const User = require("../model/signup");
const jwt = require("jsonwebtoken");

function accessToken(id, username) {
  return jwt.sign(
    { userId: id.toString(), name: username },
    "d037087c3bb218554282"
  );
}

exports.postUser = async (req, res) => {
  const { name, email, pswd } = req.body;
  console.log(req.body);
  const exist = await User.findOne({ name: name });
  if (exist) {
    return res.send("already exists");
  }

  try {
    bcrypt.hash(pswd, 10, async (err, hash) => {
      const newUser = new User({
        name: name,
        email: email,
        pswd: hash,
      });
      newUser.save();
      res.status(201).json({ message: " login successful" });
    });
  } catch (err) {
    res.status(500).json({ error: "error h yaha bhi" });
  }
};

exports.login = async (req, res) => {
  const { email, pswd } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(400).json({ error: "User does not exist" });
    return;
  }

  bcrypt.compare(pswd, user.pswd, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result) {
      res.status(201).json({
        message: "Correct password",
        token: accessToken(user._id, user.name),
      });
    } else {
      res.status(401).json({ error: "Wrong password" });
    }
  });
};
