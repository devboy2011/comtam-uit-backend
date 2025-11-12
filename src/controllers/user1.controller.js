const User = require('../models/user.model')
const moment = require('moment');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId

    const user = await User
      .findOne({ _id: userId }, 
      { email:1, fullname:1, 
        avatar: 1, dob: 1, 
        _id: 0
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

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId
    
    const { fullname, avatar, dob} = req.body
    
    let parsedDob;
    
    if (moment(dob, 'YYYY-MM-DD').isValid()) {
      parsedDob = moment(dob, 'DD-MM-YYYY').toDate();
    } else {
      parsedDob = new Date(dob);
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { name, avatar, dob: parsedDob },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({
      message: 'User info updated successfully',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal error' })
  }
}