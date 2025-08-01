const userModel = require('../user.model')
const { BadRequestError } = require('../../core/error.response')

// Find all user customer - complex query with pagination, filtering, sorting
const findAllUsers = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { createdAt: -1 } : { createdAt: 1 }

  const users = await userModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean()

  return users
}


// Find user by ID
const findUserById = async ({ userId, select = '-password' }) => {
  const user = await userModel.findById(userId).select(select).lean()

  if (!user) {
    throw new BadRequestError(`User not found with ID: ${userId}`)
  }

  return user
}

// Find user by email
const findUserByEmail = async ({ email }) => {
  return await userModel.findOne({ email }).select('-password').lean()
}

// Create new user
const createUser = async (payload) => {

  return await userModel.create(payload)
}

// Update user by ID
const updateUserById = async ({ userId, updateData }) => {
  const user = await userModel
    .findByIdAndUpdate(userId, updateData, { new: true })
    .select('-password')

  if (!user) {
    throw new BadRequestError(`User not found with ID: ${userId}`)
  }

  return user
}

module.exports = {
  findAllUsers,
  findUserById,
  findUserByEmail,
  createUser,
  updateUserById,
}
