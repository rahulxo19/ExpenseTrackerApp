const Expenses = require('../model/form')

exports.getDetails = async(req, res) => {
  const rows = await Expenses.findAll();
  res.send(rows);
}

exports.postDetail = async(req, res) => {
  const {p, c, d} = req.body;
  await Expenses.create({
    price : p,
    category : c,
    description : d
  }).catch(err => {
    console.log(err);
  })
}

exports.getDetail = async(req, res) => {
  const desc = req.query.desc;
  console.log(desc);
  await Expenses.findOne({
    where: {
      description: `${desc}`
    }
  })
  .then(row => {
    res.send(row.id.toString());
  })
  .catch(err => {
    console.error(err);
    res.sendStatus(500);
  });
}


exports.delExpense = async(req, res) => {
  const id = req.query.id;
  console.log(id);
  await Expenses.destroy({
    where: {
      id: id
    }
  }).then(result => {
    res.send('Expense Deleted')
  }).catch(err => {
    res.send('No Expense Found')
  })
}

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

