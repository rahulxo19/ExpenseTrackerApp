const Razorpay = require('razorpay');
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
        const users = await User.findAll();
        const expenses = await Expense.findAll();
        const leaderboard = [];

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const userExpenses = expenses.filter(expense => expense.userId === user.id )
            let totalExpense = 0;

            console.log(userExpenses);
            for (let j = 0; j < userExpenses.length; j++) {
                totalExpense += userExpenses[j].dataValues.price;
            }

            leaderboard.push({
                id: user.id,
                name: user.name,
                totalExpense: totalExpense
            });
        }
        res.status(200).json(leaderboard);
    } catch (err) {
        console.log(err.message);
    }
}