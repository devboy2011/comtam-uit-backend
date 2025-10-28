'use strict'

const mongoose = require('mongoose')

const DOCUMENT_NAME = 'Category'
const COLLECTION_NAME = 'categories'

const categorySchema = new mongoose.Schema(
  {
    category_id: {
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)

categorySchema.plugin(AutoIncrement, { inc_field: 'category_id' });
module.exports = mongoose.model(DOCUMENT_NAME, categorySchema)