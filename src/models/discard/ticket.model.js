'use strict'

const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const DOCUMENT_NAME = 'Ticket'
const COLLECTION_NAME = 'tickets'

const ticketSchema = new mongoose.Schema(
  {
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    ticket_id: {
      type: Number,
      unique: true,
    },
    min_price: {
      type: Number,
      required: true,
    },
    max_price: {
      type: Number,
      required: true,
    },
    remain: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)

// AutoIncrement ID
ticketSchema.plugin(AutoIncrement, { inc_field: 'ticket_id' })

module.exports = mongoose.model(DOCUMENT_NAME, ticketSchema)
