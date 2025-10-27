'use strict'

const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'orders'

const orderSchema = new mongoose.Schema(
  {
      user_id:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
      },
      total: {
        type: Number,
        default: 0,
      },
      products: [
        {
          product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
            required: true,
          },
          quantity: {
            type: Number,
            default: 1,
          },
        },
      ],
      status: {
          type: String,
          enum: ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'],
          default: 'pending',
      },
      delivery_status: [
        {
          createAt: {
            type: Date,
            default: Date.now,
          },
          shippedAt: {
              type: Date,
              default: null,
          },
          deliveredAt: {
              type: Date,
              default: null,
          },
          canceledAt: {
            type: Date,
              default: null,
          },
        }
      ]
    },
    {
      timestamps: true,
      collection: COLLECTION_NAME,
    },
)

module.exports = mongoose.model(DOCUMENT_NAME, orderSchema)
