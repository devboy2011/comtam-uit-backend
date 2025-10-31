const Cart = require('../models/carts.model')

exports.getMyCart = async (req, res) => {
  try {
    const userId = req.user.userId

    let myCart = await Cart.findOne({ user_id: userId })

    if (!myCart) {
      myCart = await Cart.create({ user_id: userId })
    }

    return res.status(200).json({
      message: 'Cart retrieved successfully',
      body: myCart,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal error' })
  }
}
