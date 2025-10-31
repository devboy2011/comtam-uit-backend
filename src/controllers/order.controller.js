const Transaction = require('../models/transaction.model');

const Order = require('../models/order.model');

// exports.getTransaction = async (req, res) => {
//     const {id} = req.params;
    
//     try {
//         const transaction = await Transaction.findOne({
//             transactionCode: id,
//             userId: req.user.userId
//         })   
        
//         if (!transaction)
//             return res.status(404).json({error: "Transaction not found"});
        
//         return res.status(200).json({
//             amount: transaction.amount,
//             orderInfo: transaction.description,
//             payDate: transaction.createdAt,
//             status: transaction.status
//         })
//     } catch (error) {
//         res.status(500).json({ error: "Service not supported" });
//     }
// }

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

