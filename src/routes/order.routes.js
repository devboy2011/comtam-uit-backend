const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const {VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat, verifyReturnUrl} = require('vnpay');
const {vnp_TmnCode, vnp_HashSecret, vnp_Url, vnp_ReturnUrl} = require('../configs/vnpay.default');

const Transaction = require('../models/transaction.model');
const Booking = require('../models/booking.model');

const orderController = require('../controllers/order.controller');

const authMiddleware = require('../middlewares/authMiddleware');    

const vnpay = new VNPay({
            tmnCode: vnp_TmnCode,
            secureSecret: vnp_HashSecret,
            vnpayHost: vnp_Url,
            testMode: true,
            hashAlgorithm: 'SHA512',
            loggerFn: ignoreLogger
        })

router.post('/create_payment_url', authMiddleware, async (req,res)=> {
    try{
        const {description, tickets, amount, userId, eventId, ticketId, fullname, tele, email} = req.body;
        
        const newTransaction = new Transaction({
            userId: userId || req.user.userId,
            eventId,
            ticketId,
            amount: parseInt(amount),
            tickets,
            description,
            fullname, tele, email
        });
        
        const savedTransaction = await newTransaction.save();
        
        console.log('save transaction')
        
        if (!savedTransaction) {
          return res.status(500).json({ error: 'Failed to create transaction' });
        }
        
        console.log('Update transaction code');
        
        const newTransactionCode = `MTP${String(savedTransaction.trans_id).padStart(6, '0')}`;
        
        const updatedTransaction = await Transaction.findOneAndUpdate(
            {trans_id: savedTransaction.trans_id},
            {$set: {
                transactionCode:  newTransactionCode
            }}
        )
        
        console.log("Updated transcode")
        
         const vnpayResponse = await vnpay.buildPaymentUrl({
            vnp_Amount: parseInt(updatedTransaction.amount),
            vnp_IpAddr: '127.0.0.1',
            vnp_TxnRef: newTransactionCode || "TEST0",
            vnp_OrderInfo: updatedTransaction.description || "this is an order",
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: vnp_ReturnUrl,
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(new Date(Date.now()+ 15*1000*60)), // expires after 15 mins
        })

        return res.status(201).json({
            url: vnpayResponse
        });
        // return res.status(201).json({
        //     body: updatedTransaction
        // });
    }
    catch(err) {
        console.log(err);
        res.status(404).json({ error: "Service not supported" });
    }
    
});

router.get('/vnpay_return', async (req, res, next) => {
    let verify;
    try {
        // Sử dụng try-catch để bắt lỗi nếu query không hợp lệ hoặc thiếu dữ liệu
        verify = vnpay.verifyReturnUrl(req.query);
        
        const vnpTransCode = req.query.vnp_TmnCode;
        const transactionCode = req.query.vnp_TxnRef
        
        if (!verify.isVerified) {
            return res.redirect(`${process.env.CORS_ORIGIN}/payment-success?order=${transactionCode}`)
        }
        
        const transaction = await Transaction.findOne({transactionCode});
            
        if (!transaction)
            return res.status(404).json({
                message: "Transaction not available"
            });
            
        if (!verify.isSuccess) {
            const updateResponse = await Transaction.findOneAndUpdate(
                {transactionCode : transaction.transactionCode},
                {$set: {status: 'failed'}}
            );
            
            return res.redirect(`${process.env.CORS_ORIGIN}/payment-success?order=${transactionCode}`)
        }
        
        const updatedTransaction = await Transaction.findOneAndUpdate(
            {transactionCode : transaction.transactionCode},
            {$set: {status: 'success'}}
        );
        
        const existedBooking = await Booking.findOne({
            transactionCode : transaction.transactionCode
        })
        
        if (existedBooking)
            return res.redirect(`${process.env.CORS_ORIGIN}/payment-success?order=${transactionCode}`)
        
        const newBooking = new Booking({
            transactionCode:  transaction.transactionCode,
            vnpTranscode: vnpTransCode,
            userId: transaction.userId,
            eventId: transaction.eventId,
            ticketId: transaction.ticketId,
            tickets: transaction.tickets,
            amount: parseInt(transaction.amount),
            status: 'success',
            description: transaction.description,
            fullname: transaction.fullname, 
            tele: transaction.tele, 
            email: transaction.email
        });
    
        const savedBooking = await newBooking.save();
        
        if (!savedBooking) {
          return res.redirect(`${process.env.CORS_ORIGIN}/payment-success?order=${transactionCode}`)
        }
        
        console.log("Saved booking");
        
        return res.redirect(`${process.env.CORS_ORIGIN}/payment-success?order=${transactionCode}`)
            
    } catch (error) {
        console.log(error)
        return res.status(400).json({message: 'Transaction failed'})
    }
});

router.get('/trans-info/:id',  
    authMiddleware, 
    orderController.getTransaction);

module.exports = router;