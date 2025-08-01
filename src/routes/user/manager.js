'use strict'

const express = require('express')
const asyncHandler = require('../../utils/asyncHandler')
const authMiddleware = require('../../middlewares/authMiddleware')
const authorizeRoles = require('../../middlewares/authRolesMiddleware')
const userController = require('../../controllers/user.controller')
const router = express.Router()

// Authentication
router.use(authMiddleware) // Verify JWT token
router.use(authorizeRoles(['MANAGER'])) // Check for MANAGER role

//GET list
router.get('', asyncHandler(userController.getAllUsers))

// Create user
router.post('', asyncHandler(userController.createUser))

// Update user
router.put('/:id', asyncHandler(userController.updateUser))

// Deactivate user
router.put('/deactivate/:id', asyncHandler(userController.deactivateUser))

// Activate user
router.put('/activate/:id', asyncHandler(userController.activateUser))

module.exports = router
