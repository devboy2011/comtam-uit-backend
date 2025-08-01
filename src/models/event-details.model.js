'use strict'

const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const DOCUMENT_NAME = 'Event-detail'
const COLLECTION_NAME = 'ticketbox_event_details'

const eventSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    title: {
      type: String,
      default: "",
    },
    bannerURL: {
      type: String,
      default: "", 
    },
    url: {
      type: String,
      default: "", 
    },
    description: {
      type: String,
      default: "", 
    },
    type:{
        type: Number,
        default: 0,
    },
    venue : {
      type: String,
      default: "", 
    },
    address: {
        type: String,
        default: "", 
    },
    logoURL: {
      type: String,
      default: "", 
    },
    orgName: {
        type: String,
        default: "",
    },
    orgDescription: {
        type: String,
        default: "",
    },
    isFree: {
      type: Boolean,
      default: false, 
    },
    isHot:  {
      type: Boolean,
      default: false, 
    },
    isFormIncludedL: {
      type: Boolean,
      default: true, 
    },
    isFormPerOrder: {
      type: Boolean,
      default: true, 
    },
    hasPhysicalItem: {
      type: Boolean,
      default: false, 
    },
    minTicketPrice: {
      type: mongoose.Schema.Types.Int32,
      default: 0,
    },
    hasMoreThanOneShowing: {
      type: Boolean,
      default: true, 
    },
    isBookingAllowed: {
      type: Boolean,
      default: true, 
    },
    status: {
        type: String,
        default: "ACTIVE", 
    },
    statusName: {
        type: String,
        default: ""
    },
    showings: {
        type: Array,
        default: [],
    },
    startTime: {
      type: Date,
      default: new Date(Date.now()),
    },
    endTime: {
        type: Date,
        default: new Date(Date.now()) + 30* 48600000, // Default to 30 days from now
    },
    originalId: {
      type: Number,
      // Reference to the event's own id
    },
    originalId_v2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    categoriesV2: {
        type: Array,
        default: ['others'],
    },
    locationId: {
      type: String,
      default: "",
    },
    remaining_tickets: {
      type: Number,
      default: 0
    },
    location: {
      type: String,
      default: "Hồ Chí Minh",
    },
    deletedAt: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: false, // Disable automatic timestamps
    collection: COLLECTION_NAME,
  },
)

module.exports = mongoose.model(DOCUMENT_NAME, eventSchema)