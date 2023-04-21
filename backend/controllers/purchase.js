const Razorpay = require('razorpay');
const sequelize = require('sequelize');
const Order = require('../model/orders');
const Expense = require('../model/form');
const User = require('../model/signup');

module.exports.purchaseMembership = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RZRPAY_KEY_ID,
            key_secret: process.env.RZRPAY_SECRET_ID
        });
        const amount = 500;

        await rzp.orders.create({ amount, currency: "INR" })
            .then(async (order) => {
                try {
                    await req.user.createOrder({ orderid : order.id, status: 'PENDING' });
                    return res.status(201).json({ order, key_id: rzp.key_id });
                } catch (err) {
                    throw err;
                }
            })
            .catch(err => {
                console.error(err);
                // Handle the error appropriately, e.g. return an error response to the client
                return res.status(500).json({ error: 'Failed to create order' });
            });
    } catch (err) {
        console.error(err);
        // Handle the error appropriately, e.g. return an error response to the client
        return res.status(500).json({ error: 'Failed to create order' });
    }
};

module.exports.updateMembership = async (req, res) => {
try {
    const { order_id, payment_id } = req.body
    const order = await Order.findOne({ where : { orderid : order_id }})
    const promise = await order.update({ paymentid : payment_id, status : "SUCCESS" });
    const promise2 = await req.user.update({ ispremiumuser: true });
    await Promise.all([promise, promise2])
    res.status(202).json({ message: " You are a Premium User"})

} catch (err) {
    console.log(err.message);
}
}

module.exports.leaderboard = async (req, res) => {
    try {
      const leaderboard = await User.findAll({
        attributes: ['id', 'name',[sequelize.fn("COALESCE", sequelize.fn('SUM', sequelize.col('expenses.price')), 0), 'totalExpense']],
        include: [{ model: Expense, as: 'expenses', attributes: [] }],
        group: ['users.id'],
        order: [[sequelize.literal('totalExpense'), 'DESC']]
      });
  
      res.status(200).json(leaderboard);
    } catch (err) {
      console.log(err.message);
    }
  };
  

// module.exports.leaderboard = async (req, res) => {
//     try {
//       const users = await User.findAll();
//       const expenses = await Expense.findAll();
  
//       const userExpensesMap = expenses.reduce((acc, expense) => {
//         const userId = expense.userId;
//         if (!acc[userId]) {
//           acc[userId] = 0;
//         }
//         acc[userId] += expense.price;
//         return acc;
//       }, {});
  
//       const leaderboard = users.map(user => {
//         const totalExpense = userExpensesMap[user.id] || 0;
//         return {
//           id: user.id,
//           name: user.name,
//           totalExpense: totalExpense
//         };
//       });
  
//       leaderboard.sort((a, b) => {
//         return b.totalExpense - a.totalExpense;
//       });
  
//       res.status(200).json(leaderboard);
//     } catch (err) {
//       console.log(err.message);
//     }
//   }
  