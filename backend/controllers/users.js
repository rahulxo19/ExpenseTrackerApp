const User = require("../model/signup");

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
    await User.create({ name, email, pswd });
    res.status(201).json({ message: " User created Successfully" });
  } catch (err) {
    res.status(500).json({ error: "error h yaha bhi" });
  }
};

exports.login = async (req, res) => {
  const { email, pswd } = req.body;
  const exist = await User.findOne({
    where: {
      email: `${email}`
    },
  });
  if (exist) {
    const pass = await User.findOne({
      where: {
        pswd: `${pswd}`
      }
    })
    if(pass){
      res.status(201).json({ message : "correct password"})
    }
    else {
      res.status(401).json({ error : " wrong password"})
    }
  }
  else {
    res.status(400).json({ error: "User does not exist"})
  }
}
