'use strict'

const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const DOCUMENT_NAME = 'BannerEvent'
const COLLECTION_NAME = 'ticketbox_banner_events'

const eventSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      default: "https://images.tkbcdn.com/2/608/332/ts/ds/d7/ca/da/05869cacf8a20ea0871833237856ba07.png", 
    },
    videoUrl: {
      type: String,
      default: "https://salt.tkbcdn.com/ts/ds/19/15/75/af1e6b77047fc816760d3dd0496fe0d9.mp4", 
    },
    eventId: {
      type: Number,
      unique: true,
    },
    typeEvent: {
      type: String,
      default: "banner",
    },
    price: {
      type: mongoose.Schema.Types.Int32,
      default: 0,
    },  
    showingTime: {
      type: Date,
      default: new Date(Date.now()).toISOString,
    },
    startTime: {
      type: Date,
      default: new Date(Date.now()).toISOString,
    },
    endTime: {
      type: Date,
      default: new Date(Date.now()).toISOString,
    },
    deeplink: {
      type: String,
      default: "https://ticketbox.vn/phat-bao-nghiem-tran-trien-lam-di-san-phat-giao-doc-ban-giua-long-sai-gon-24329?utm_medium=sr-all-dates_all-prices&utm_source=tkb-search-results",
    },
    titleImageUrl: {
      type: String,
      default: "https://images.tkbcdn.com/2/608/332/ts/ds/d7/ca/da/05869cacf8a20ea0871833237856ba07.png",
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    originalId: {
      type: Number,
      // Reference to the event's own id
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