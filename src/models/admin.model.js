'use strict'

const mongoose = require('mongoose')

const DOCUMENT_NAME = 'Admins'
const COLLECTION_NAME = 'admins'
const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: 'https://images.tkbcdn.com/2/608/332/ts/ds/d7/ca/da/05869cacf8a20ea0871833237856ba07.png',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    roles: {
      type: Array,
      default: ['MANAGER'],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)

module.exports = mongoose.model(DOCUMENT_NAME, adminSchema)
