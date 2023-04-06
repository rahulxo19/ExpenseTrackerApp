const bcrypt = require('bcrypt')
const User = require("../model/signup");
const jwt = require("jsonwebtoken")

function accessToken(id, username){
return jwt.sign({ userId : id, name : username},"d037087c3bb218554282" )
}

exports.postUser = async (req, res) => {
  const { name, email, pswd } = req.body;
  console.log(name);
  const exist = await User.findOne({
    where: {
      name: `${name}`,
    },
  });
  if (exist) {
    res.status(400).json({ error: " User already exists" });
  }
  
  try {
    bcrypt.hash(pswd, 10, async (err,hash)=> {
      await User.create({ name: name, email: email, pswd: hash });
      res.status(201).json({ message: " User created Successfully" });
  
    })
  } catch (err) {
    res.status(500).json({ error: "error h yaha bhi" });
  }
};

exports.login = async (req, res) => {
  const { email, pswd } = req.body;
  const user = await User.findOne({
    where: {
      email: email
    }
  });
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
      res.status(201).json({ message: "Correct password", token : accessToken(user.id, user.name) });
    } else {
      res.status(401).json({ error: "Wrong password" });
    }
  });
};

