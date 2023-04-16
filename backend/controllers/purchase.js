const Razorpay = require('razorpay');
const Order = require('../model/orders');

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
                    console.log(order);
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
    console.log(req.body);
    const { order_id, payment_id } = req.body
    const order = await Order.findOne({ where : { orderid : order_id }})
    const promise = await order.update({ paymentid : payment_id, status : "SUCCESS" });
    const promise2 = await req.user.update({ ispremiumuser: true });
    await Promise.all([promise, promise2])
    res.status(202).json({ message: " Successful"})

} catch (err) {
    console.log(err.message);
}
}