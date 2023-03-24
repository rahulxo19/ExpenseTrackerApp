const User = require('../model/form')

exports.postDetails = (req,res,next) => {
    const name = req.body.name;
    const email = req.body.email;
    User.create({
        name : name,
        email : email
    }).catch(err => {
        console.log(err);
    })
}

exports.getDetails = async (req, res, next ) => {
    const rows = await User.findAll()
    res.send(rows);
}

exports.deleteUser = async (req, res, next) => {
  const name = req.params.name;
  console.log(name);

  try {
    const deletedUser = await User.destroy({
      where: { name }
    });

    if (deletedUser) {
      res.status(200).json({ message: `User ${name} has been deleted` });
    } else {
      res.status(404).json({ message: `User ${name} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

