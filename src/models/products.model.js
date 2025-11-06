'use strict'

const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const slugify = require('slugify')

const DOCUMENT_NAME = 'Products'
const COLLECTION_NAME = 'products'

const removeAccents  = require('../utils/removeAccent.js') ;

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      default: uuidv4,
    },
    name: {
      type: String,
      required: true,
    },
    nameNonAccent:{
      type: String,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    remained: {
      type: Number,
      default: 10,
    },
    desc: {
      type: String,
      default: "Chưa có mô tả"
    },
    descNonAccent: {
      type: String,
      index: true,
    },
    img: {
      type: String,
      default: "https://via.placeholder.com/150"
    },
    category_list: [{
      category_id: {
          type: Number,
          required: true,
      },
      name: {
          type: String,
          required: true,
      }
    }]
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)

productSchema.pre('save', async function (next) {
  this.slug = this.slug || slugify(this.name);
  if (this.name) {
    this.nameNonAccent = removeAccents(this.name);
  }
  if (this.desc) {
    this.descNonAccent = removeAccents(this.desc);
  }
  next();
});

productSchema.index({ name: 'text', desc: 'text' })
productSchema.index({ nameNonAccent: 'text', descNonAccent: 'text' })

module.exports = mongoose.model(DOCUMENT_NAME, productSchema)