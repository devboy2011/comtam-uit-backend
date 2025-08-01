const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const DOCUMENT_NAME = 'EventCategory'
const COLLECTION_NAME = 'event_categories'

const eventCategorySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
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

eventCategorySchema.plugin(AutoIncrement, {
  inc_field: 'id',
  id: 'event_category_seq',
})

module.exports = mongoose.model(DOCUMENT_NAME, eventCategorySchema)
