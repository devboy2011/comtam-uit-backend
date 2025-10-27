'use strict'

const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const slugify = require('slugify')

const DOCUMENT_NAME = 'BlogCategory'
const COLLECTION_NAME = 'blog_categories'

const blogCategorySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
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


//  update (query)
blogCategorySchema.pre(
  ['findOneAndUpdate', 'updateOne', 'findByIdAndUpdate'],
  function (next) {
    const update = this.getUpdate()
    if (update.name) {
      update.slug = slugify(update.name, { lower: true, strict: true })
    }
    next()
  },
)

// Run before save
blogCategorySchema.pre('save', async function (next) {
  // Auto generate slug if not
  if (!this.slug || this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }

  //  Auto generate ID
  if (this.isNew && !this.id) {
    try {
      // Tìm document có ID cao nhất
      const highestDoc = await mongoose
        .model(DOCUMENT_NAME)
        .findOne()
        .sort({ id: -1 })
        .select('id')
      
      // Set ID = highest + 1, hoặc 1 nếu chưa có document nào
      this.id = (highestDoc?.id || 0) + 1
    } catch (error) {
      console.error('Error generating ID:', error)
    }
  }
  
  next()
})

module.exports = mongoose.model(DOCUMENT_NAME, blogCategorySchema)
