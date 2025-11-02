'use strict'

const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
    img: {
        type: String,
        default: "https://via.placeholder.com/150"
    }
  },
  {
    timestamps: false,
    collection: COLLECTION_NAME,
  },
)

categorySchema.plugin(AutoIncrement, { inc_field: 'category_id' });
module.exports = mongoose.model(DOCUMENT_NAME, categorySchema)