'use strict'

const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const DOCUMENT_NAME = 'Products'
const COLLECTION_NAME = 'products'

const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      unique: true,
      default: uuidv4,
    },
    price: {
      type: Number,
      required: true,
    },
    remained: {
      type: Number,
      default: 0,
    },
    desc: {
        type: String,
        default: "Chưa có mô tả"
    },
    img: {
        type: String,
        default: "https://via.placeholder.com/150"
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)

module.exports = mongoose.model(DOCUMENT_NAME, productSchema)