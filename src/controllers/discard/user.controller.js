'use strict'
const userService = require('../services/user.service')

const { OK, CREATED } = require('../core/success.response')
const { BadRequestError } = require('../core/error.response')
class UserController {
  //GET
  getAllUsers = async (req, res, next) => {
    new OK({
      message: 'List all user success',
      metadata: await userService.findAllUsers(req.query),
    }).send(res)
  }

  // Create user by manager
  createUser = async (req, res, next) => {
    new CREATED({
      message: 'Create user success',
      metadata: await userService.createUser(req.body),
    }).send(res)
  }

  // Update user by manager
  updateUser = async (req, res, next) => {
    new OK({
      message: 'Update user success',
      metadata: await userService.updateUser(req.params.id, req.body),
    }).send(res)
  }

  // Deactivate user
  deactivateUser = async (req, res, next) => {
    new OK({
      message: 'Deactivate user success',
      metadata: await userService.deactivateUser(req.params.id),
    }).send(res)
  }

  // Activate user
  activateUser = async (req, res, next) => {
    new OK({
      message: 'Activate user success',
      metadata: await userService.activateUser(req.params.id),
    }).send(res)
  }
// Get own profile
  getUserProfile = async (req, res, next) => {
    const currentUserId = req.user?.userId

    if (!currentUserId) {
      throw new BadRequestError('Unauthorized')
    }

    new OK({
      message: 'Get user success',
      metadata: await userService.findUserById({ userId: currentUserId }),
    }).send(res)
  }

  // Update own profile
  updateOwnProfile = async (req, res, next) => {
    const currentUserId = req.user?.userId

    if (!currentUserId) {
      throw new BadRequestError('Unauthorized')
    }

    // cannot update
    delete req.body.roles
    delete req.body.status

    new OK({
      message: 'Update profile success',
      metadata: await userService.updateUser(currentUserId, req.body),
    }).send(res)
  }

  // Deactivate own account
  deactivateOwnAccount = async (req, res, next) => {
    const currentUserId = req.user?.userId

    if (!currentUserId) {
      throw new BadRequestError('Unauthorized')
    }

    new OK({
      message: 'Account deactivated successfully',
      metadata: await userService.deactivateUser(currentUserId),
    }).send(res)
  }
}

module.exports = new UserController()
