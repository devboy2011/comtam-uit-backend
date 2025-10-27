'use strict'

const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const DOCUMENT_NAME = 'Carts'
const COLLECTION_NAME = 'carts'

const cartSchema = new mongoose.Schema(
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
    ]
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)

module.exports = mongoose.model(DOCUMENT_NAME, cartSchema)