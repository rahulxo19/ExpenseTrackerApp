const Expenses = require("../model/form");
const User = require("../model/signup");
const mongoose = require("mongoose");

exports.download = async (req, res) => {
  try {
    const userId = req.user._id;
    const prem = await User.findOne({ _id: userId });
    if (prem.ispremiumuser) {
      const expenses = await Expenses.findAll({ userId });
      console.log(JSON.stringify(expenses));
      res.status(201).send(JSON.stringify(expenses));
    } else {
      res.status(401).json({ message: "You are not a premium User" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ message: "Error Detected while Downloading" });
  }
};

exports.getDetails = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const rows = await Expenses.find({ userId });
    res.send(rows);
  } catch (err) {
    // Handle any errors that occur during database query
    console.log(err);
    res.json({ message: "Error retrieving expenses" });
  }
};

exports.getMemb = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    if (userId != null) {
      const prem = await User.findOne({ _id: userId });
      return res.send(prem.ispremiumuser);
    } else {
      return res.send(false);
    }
  } catch (err) {
    console.log(err.message);
  }
};

exports.postDetail = async (req, res) => {
  const { p, c, d } = req.body;
  const newExpense = new Expenses({
    price: p,
    category: c,
    description: d,
    userId: req.user._id,
  });
  newExpense
    .save()
    .then(() => {
      res.send("this is post submit");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getDetail = async (req, res) => {
  const desc = req.params.desc;
  console.log(desc);
  await Expenses.findOne({
    description: desc,
  })
    .then((item) => {
      res.send(item._id);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

exports.delExpense = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedExpense = await Expenses.findOneAndDelete({
      _id: id,
    });

    if (deletedExpense) {
      return res.status(200).json({
        message: "Expense deleted successfully",
        expense: deletedExpense,
      });
    } else {
      console.log(deletedExpense);
      return res.status(404).json({ message: "Expense not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting expense" });
  }
};

// exports.postDetails = (req,res,next) => {
//     const name = req.body.name;
//     const email = req.body.email;
//     User.create({
//         name : name,
//         email : email
//     }).catch(err => {
//         console.log(err);
//     })
// }

// exports.getDetails = async (req, res, next ) => {
//     const rows = await User.findAll()
//     res.send(rows);
// }

// exports.deleteUser = async (req, res, next) => {
//   const name = req.params.name;
//   console.log(name);

//   try {
//     const deletedUser = await User.destroy({
//       where: { name }
//     });

//     if (deletedUser) {
//       res.status(200).json({ message: `User ${name} has been deleted` });
//     } else {
//       res.status(404).json({ message: `User ${name} not found` });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
