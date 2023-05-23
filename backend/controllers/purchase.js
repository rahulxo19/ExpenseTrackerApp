const Razorpay = require("razorpay");
const sequelize = require("sequelize");
const Order = require("../model/orders");
const Expenses = require("../model/form");
const User = require("../model/signup");

module.exports.purchaseMembership = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RZRPAY_KEY_ID,
      key_secret: process.env.RZRPAY_SECRET_ID,
    });
    const amount = 500;

    await rzp.orders
      .create({ amount, currency: "INR" })
      .then(async (order) => {
        try {
          const newOrder = new Order({
            userId: req.user._id,
            orderid: order.id,
            status: "PENDING",
          });
          newOrder.save();
          console.log(newOrder);
          return res.status(201).json({ order, key_id: rzp.key_id });
        } catch (err) {
          throw err;
        }
      })
      .catch((err) => {
        console.error(err);
        // Handle the error appropriately, e.g. return an error response to the client
        return res.status(500).json({ error: "Failed to create order" });
      });
  } catch (err) {
    console.error(err);
    // Handle the error appropriately, e.g. return an error response to the client
    return res.status(500).json({ error: "Failed to create order" });
  }
};

module.exports.updateMembership = async (req, res) => {
  try {
    const { order_id, payment_id } = req.body;

    const order = await Order.findOne({ orderid: order_id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.paymentid = payment_id;
    order.status = "SUCCESS";
    const updatedOrder = await order.save();

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.ispremiumuser = true;
    const updatedUser = await user.save();

    res.status(202).json({ message: "You are now a Premium User" });
  } catch (err) {
    console.error("Error updating membership:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.leaderboard = async (req, res) => {
  try {
    const leaderboard = await User.aggregate([
      {
        $lookup: {
          from: "expenses",
          localField: "_id",
          foreignField: "userId",
          as: "expenses",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalExpense: { $sum: "$expenses.price" },
        },
      },
      {
        $sort: { totalExpense: -1 },
      },
    ]);

    res.status(200).json(leaderboard);
  } catch (err) {
    console.error("Error retrieving leaderboard:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// module.exports.leaderboard = async (req, res) => {
//     try {
//       const users = await User.findAll();
//       const expenses = await Expenses.findAll();

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
