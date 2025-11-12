const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const { jwtSecret, jwtExpiresIn } = require('../configs/jwt.config')

const User = require('../models/user.model')
const Session = require('../models/session.model')

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body

    // Kiểm tra trùng email
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' })
    }

    // Băm mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10)

    // Tạo user mới
    const newUser = new User({
      email,
      password: hashedPassword,
      roles: ['CUSTOMER'],
    })

    await newUser.save()

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        roles: newUser.roles,
        status: newUser.status,
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password, tele } = req.body
    let existingUser;

    if (!tele) {
      existingUser = await User.findOne({ name: username })
      
      // Kiểm tra user tồn tại
      if (!existingUser)
        existingUser = await User.findOne({ email: username })
      
      if (!existingUser)
        return res.status(401).json({ 
          error: 'Invalid username or password' 
        })

      // So sánh mật khẩu
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password,
      )
  
      if (!isPasswordValid)
        return res.status(401).json({ error: 'Invalid password' })
    } 
    else {
      existingUser = await User.findOne({ tele })
      if (!existingUser)
        return res.status(401).json({ error: 'Bạn chưa đăng kí tài khoản' });
    }

    // Xoá session cũ nếu có
    const existingSession = await Session.findOne({ userId: existingUser._id })

    if (existingSession) {
      Session.deleteOne({ userId: existingUser._id })
    }

    const sessionToken = uuidv4()
    const accessToken = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email ||  '',
        tele: existingUser.tele ||  '',
        roles: existingUser.roles,
        sessionToken,
      },
      jwtSecret,
      { expiresIn: jwtExpiresIn },
    )

    const refreshToken = jwt.sign(
      { userId: existingUser._id, sessionToken },
      jwtSecret,
      { expiresIn: '7d' }, // Refresh token expires in 7 days
    )

    await Session.create({
      userId: existingUser._id,
      sessionToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    })

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      sessionToken,
      body: {
        avatar: existingUser.avatar,
        name: existingUser.name,
        email: existingUser.email,
      },
    })
  } catch (err) {
    if (res.statusCode !== 401) res.status(500).json({ error: err.message })
  }
}

exports.logout = async (req, res) => {
  try {
    const { sessionToken } = req.body

    if (!sessionToken) {
      return res.status(400).json({ error: 'Session token is required' })
    }

    const deleteResponse = await Session.deleteOne({ sessionToken })
    console.log('Deleted session:', deleteResponse)

    if (deleteResponse.deletedCount === 0)
      return res.status(404).json({ error: 'Session not found' })
    else return res.status(200).json({ message: 'Logged out successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.verifyToken = async (req, res, next) => {
  try {
    console.log(req.user)

    if (!req.user || !req.user.sessionToken) {
      return res.status(401).json({ error: 'Unauthorized access' })
    }

    console.log('Verifying session token:', req.user.sessionToken)

    if (new Date(req.user.exp * 1000) < Date.now())
      return res.status(401).json({ error: 'Session expired' })

    const sessionToken = req.user.sessionToken

    const session = await Session.findOne({ userId: req.user.userId })

    console.log('Found session:', session)

    if (!session) {
      return res.status(401).json({ error: 'Session not found' })
    }

    if (session.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Session expired' })
    }

    return res.status(200).json({ message: 'Token is valid' })

    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid access token' })
  }
}

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token is required' })
    }

    const decoded = jwt.verify(refreshToken, jwtSecret)

    const session = await Session.findOne(
      {
        sessionToken: decoded.sessionToken,
        refreshToken: refreshToken,
      },
      {},
    )

    if (!session) {
      return res.status(401).json({ error: 'Invalid refresh token' })
    }

    const existingUser = await User.findById({ _id: decoded.userId })

    const newAccessToken = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        roles: existingUser.roles,
        sessionToken: session.sessionToken,
      },
      jwtSecret,
      { expiresIn: jwtExpiresIn },
    )

    res.status(200).json({
      accessToken: newAccessToken,
      message: 'Access token refreshed successfully',
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
