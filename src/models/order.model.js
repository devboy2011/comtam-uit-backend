'use strict'

const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'orders'

const orderSchema = new mongoose.Schema(
  {
    // Internal auto-increment
    seq: {
      type: Number,
      unique: true,
    },
    // Public orderID "ORD001"
    id: {
      type: String,
      unique: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tickets: [
      {
        ticket_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Ticket',
          required: true,
        },
        event_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Event',
        },
        ticket_name: {
          type: String,
        },
        ticket_price: {
          type: Number,
        },
        ticket_quantity: {
          type: Number,
        },
      },
    ],
    price: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['COMPLETE', 'PENDING', 'CANCEL'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)

// Auto-increment
orderSchema.plugin(AutoIncrement, { inc_field: 'seq', id: 'order_seq' })

// id
orderSchema.pre('save', function (next) {
  if (this.isNew && !this.id) {
    // ORD001, ORD012, ...
    this.id = `ORD${String(this.seq).padStart(3, '0')}`
  }
  next()
})

module.exports = mongoose.model(DOCUMENT_NAME, orderSchema)
