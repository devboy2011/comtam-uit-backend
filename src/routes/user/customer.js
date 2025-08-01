'use strict'

const express = require('express')
const authMiddleware = require('../../middlewares/authMiddleware')
const userController = require('../../controllers/user.controller')
const asyncHandler = require('../../utils/asyncHandler')
const router = express.Router()

// GET user profile
router.get(
  '/profile',
  authMiddleware,
  asyncHandler(userController.getUserProfile),
)

// Update own profile
router.put(
  '/profile',
  authMiddleware,
  asyncHandler(userController.updateOwnProfile),
)

// Deactivate own account
router.put(
  '/deactivate',
  authMiddleware,
  asyncHandler(userController.deactivateOwnAccount),
)

module.exports = router
