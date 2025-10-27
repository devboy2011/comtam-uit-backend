'use strict'

const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const DOCUMENT_NAME = 'SpecialEvent'
const COLLECTION_NAME = 'ticketbox_special_events'

const eventSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    originalId: {
      type: Number,
      // Reference to the event's own id
    },
    imageUrl: {
      type: String,
      default: "https://images.tkbcdn.com/2/608/332/ts/ds/d7/ca/da/05869cacf8a20ea0871833237856ba07.png", 
    },
    deeplink: {
      type: String,
      default: "https://ticketbox.vn/phat-bao-nghiem-tran-trien-lam-di-san-phat-giao-doc-ban-giua-long-sai-gon-24329?utm_medium=sr-all-dates_all-prices&utm_source=tkb-search-results",
    },
    isNewBookingFlow: {
      type: Boolean,
      default: true,
    },
    },
  {
    timestamps: false, // Disable automatic timestamps
    collection: COLLECTION_NAME,
  },
)

// eventSchema.plugin(AutoIncrement, { inc_field: 'id' })

module.exports = mongoose.model(DOCUMENT_NAME, eventSchema)