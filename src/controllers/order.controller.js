const Transaction = require('../models/transaction.model');

const Order = require('../models/order.model');

exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const myOrders = await Order.find({ user_id: userId });

        if (!myOrders || myOrders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        return res.status(200).json({
            message: "Orders retrieved successfully",
            body: myOrders,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal error" });
    }
}

