'use strict'

const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const slugify = require('slugify')

const DOCUMENT_NAME = 'Blog'
const COLLECTION_NAME = 'article_details'

// friendly time
function generateFriendlyTime(datetime) {
  const date = new Date(datetime)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${hours}:${minutes} ${day}/${month}/${year}`
}
// published date
function generatePublishedDate(datetime) {
  const date = new Date(datetime)

  const daysOfWeek = [
    'Chủ nhật',
    'Thứ hai',
    'Thứ ba',
    'Thứ tư',
    'Thứ năm',
    'Thứ sáu',
    'Thứ bảy',
  ]

  const dayOfWeek = daysOfWeek[date.getDay()]
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${dayOfWeek}, ${day}/${month}/${year} ${hours}:${minutes} (GMT+7)`
}

const blogSchema = new mongoose.Schema(
  {
    article_id: {
      type: Number,
      unique: true,
    },
    article_friendly_time: {
      type: String,
    },
    article_datetime: {
      type: Date,
    },
    published_date: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    short_description: {
      type: String,
    },
    thumpnail: {
      type: String,
    },
    author: {
      type: String,
    },
    summary: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: [String],
      default: [],
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlogCategory',
      required: true,
    },
  },
  {
    timestamps: false, // Turn off due to article_datetime
    collection: COLLECTION_NAME,
  },
)

// Index for search
blogSchema.index({ title: 'text', short_description: 'text', summary: 'text' })

//  update (query)
blogSchema.pre(
  ['findOneAndUpdate', 'updateOne', 'findByIdAndUpdate'],
  function (next) {
    const update = this.getUpdate()
    if (update.title) {
      update.slug = slugify(update.title, { lower: true, strict: true })
    }
    if (update.article_datetime) {
      update.article_friendly_time = generateFriendlyTime(
        update.article_datetime,
      )
      update.published_date = generatePublishedDate(update.article_datetime)
    }
    this.setUpdate(update)
    next()
  },
)

// Run before save
blogSchema.pre('save', async function (next) {
  // Auto generate article_id nếu chưa có
  if (this.isNew && !this.article_id) {
    try {
      const highestDoc = await mongoose
        .model(DOCUMENT_NAME)
        .findOne()
        .sort({ article_id: -1 })
        .select('article_id')

      this.article_id = (highestDoc?.article_id || 0) + 1
    } catch (error) {
      console.error('Error generating article_id:', error)
    }
  }

  // Set article_datetime to current time if not provided
  if (!this.article_datetime) {
    this.article_datetime = new Date()
  }

  // Auto-generate article_friendly_time from article_datetime
  if (!this.article_friendly_time || this.isModified('article_datetime')) {
    this.article_friendly_time = generateFriendlyTime(this.article_datetime)
  }

  // Auto-generate published_date from article_datetime
  if (!this.published_date || this.isModified('article_datetime')) {
    this.published_date = generatePublishedDate(this.article_datetime)
  }

  // Always generate slug
  if (!this.slug || this.isModified('title')) {
    if (this.title) {
      this.slug = slugify(this.title, {
        lower: true,
        strict: true,
      })
    }
  }

  next()
})



module.exports = mongoose.model(DOCUMENT_NAME, blogSchema)
