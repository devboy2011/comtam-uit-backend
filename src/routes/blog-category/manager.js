'use strict'

const express = require('express')
const blogCategoryController = require('../../controllers/blog-category.controller')
const asyncHandler = require('../../utils/asyncHandler')
const authMiddleware = require('../../middlewares/authMiddleware')
const authorizeRoles = require('../../middlewares/authRolesMiddleware')
const router = express.Router()

// Authentication
router.use(authMiddleware) // Verify JWT token
router.use(authorizeRoles(['MANAGER'])) // Check for MANAGER role

// Create by manager
router.post('', asyncHandler(blogCategoryController.createBlogCategory))
// Update by manager
router.put('/:id', asyncHandler(blogCategoryController.updateBlogCategory))
// Delete by manager
router.delete('/:id', asyncHandler(blogCategoryController.deleteBlogCategory))

module.exports = router
