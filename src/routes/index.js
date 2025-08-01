'use strict'

const express = require('express')
const router = express.Router()

// Blog
router.use('/api/v0/blogs', require('./blog/public'))
router.use('/api/v0/manager/blogs', require('./blog/manager'))

// Blog Category
router.use('/api/v0/blog-categories', require('./blog-category/public'))
router.use('/api/v0/manager/blog-categories', require('./blog-category/manager'))

// User
router.use('/api/v0/users', require('./user/customer'))
router.use('/api/v0/manager/users', require('./user/manager'))

module.exports = router