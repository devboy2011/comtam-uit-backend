'use strict'

const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const DOCUMENT_NAME = 'Transaction'
const COLLECTION_NAME = 'transactions'

const transactionSchema = new mongoose.Schema(
  {
    trans_id: {
      type: Number,
      unique: true,
    },
    transactionCode: {
        type: String,
        // unique: true
    },
    userId: {
        type: String,
        default: ''
    },
    eventId: {
        type: String,
        default: ''
    },
    ticketId: {
        type: String,
        default: ''
    },
    amount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: new Date(Date.now()),
    },
    deletedAt: {
        type: Date,
        default: null
    },
    tickets: {
        type: Array,
        default: []
    },
    description: {
        type: String,
        default: 'Booking transaction'
    },
    fullname:{
        type: String,
        default: ''
    },
    tele: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    }
  },
  {
    timestamps: false, // Disable automatic timestamps
    collection: COLLECTION_NAME,
  },
)

transactionSchema.plugin(AutoIncrement, { inc_field: 'trans_id' });

// transactionSchema.post('save', async function(doc, next){
//     if (!doc.transactionCode && doc.trans_id)
//         doc.transactionCode = `MTP${String(doc.trans_id).padStart(6, '0')}`;
//     await doc.save();
//     next();
// })

module.exports = mongoose.model(DOCUMENT_NAME, transactionSchema)