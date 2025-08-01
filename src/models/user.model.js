'use strict'

const mongoose = require('mongoose')

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'users'
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    name: {
      type: String,
      default: 'user',
    },
    avatar: {
      type: String,
      default:
        'https://images.tkbcdn.com/2/608/332/ts/ds/0f/dd/22/af053e21394812a4e0226b6e843a2f57.png',
    },
    roles: {
      type: Array,
      default: ['CUSTOMER'],
    },
    dob: {
      type: Date,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)

module.exports = mongoose.model(DOCUMENT_NAME, userSchema)
