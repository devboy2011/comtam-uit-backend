const User = require('../models/user.model')

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId

    const user = await User
      .findOne({ _id: userId }, 
      { email:1, name:1, 
        phone:1, avatar: 1, dob: 1, 
        address: 1, 
      });

    if (!user)
      return res.status(404).json({
        message: 'No user found',
      })

    return res.status(200).json({
      message: 'User info retrieved successfully',
      body: user,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal error' })
  }
}

