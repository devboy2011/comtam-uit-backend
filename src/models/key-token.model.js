'use strict'

const mongoose = require('mongoose')

const DOCUMENT_NAME = 'Key'
const COLLECTIONS_NAME = 'keys'

const keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    privateKey: {
      type: String,
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTIONS_NAME,
  },
)

module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema)
