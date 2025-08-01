const Transaction = require('../models/transaction.model');

exports.getTransaction = async (req, res) => {
    const {id} = req.params;
    
    try {
        const transaction = await Transaction.findOne({
            transactionCode: id,
            userId: req.user.userId
        })   
        
        if (!transaction)
            return res.status(404).json({error: "Transaction not found"});
        
        return res.status(200).json({
            amount: transaction.amount,
            orderInfo: transaction.description,
            payDate: transaction.createdAt,
            status: transaction.status
        })
    } catch (error) {
        res.status(500).json({ error: "Service not supported" });
    }
}

