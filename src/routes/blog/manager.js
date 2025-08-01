'use strict'

const express = require('express')
const blogController = require('../../controllers/blog.controller')
const asyncHandler = require('../../utils/asyncHandler')
const authMiddleware = require('../../middlewares/authMiddleware')
const authorizeRoles = require('../../middlewares/authRolesMiddleware')
const router = express.Router()

//Authentication
router.use(authMiddleware) // Verify JWT token
router.use(authorizeRoles(['MANAGER'])) // Check for MANAGER role

// Create by manager
router.post('', asyncHandler(blogController.createBlog))
// Update by manager
router.put('/:id', asyncHandler(blogController.updateBlog))
// Delete by manager
router.delete('/:id', asyncHandler(blogController.deleteBlog))

module.exports = router
