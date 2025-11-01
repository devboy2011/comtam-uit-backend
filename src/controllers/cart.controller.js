const Cart = require('../models/carts.model')

exports.getMyCart = async (req, res) => {
  try {
    const userId = req.user.userId

    let myCart = await Cart.findOne({ user_id: userId }, {total: 1, products: 1})

    if (!myCart) {
      myCart = await Cart.create({ user_id: userId })
      return res.status(400).json({
        message: 'Cart created successfully, but was empty',
        body: myCart,
      })
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

exports.addToCart = async (req, res) => {
try {
    const userId = req.user.userId

    let myCart = await Cart.findOne({ user_id: userId })

    if (!myCart) {
      myCart = await Cart.create({ user_id: userId })
    }

    const { product_id, quantity } = req.body;

    const existingProduct = myCart.products.find(item => item.product_id === product_id);

    if (existingProduct) {
      res.status(400).json({ error: 'Product already in cart' });
    } else {
      myCart.products.push({ product_id, quantity });
      myCart.total += quantity;
    }

    await myCart.save();

    return res.status(200).json({
      message: 'Product added to cart successfully',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal error' })
  }
}

exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId

    let myCart = await Cart.findOne({ user_id: userId })

    if (!myCart) {
      myCart = await Cart.create({ user_id: userId })
    }

    const { product_id, quantity } = req.body;

    const existingProduct = myCart.products.find(item => item.product_id === product_id);

    if (existingProduct) {
      myCart.total += (quantity - existingProduct.quantity);
      existingProduct.quantity = quantity;
    } else {
      return res.status(400).json({ error: 'Product not found in cart' });
    }

    await myCart.save();

    return res.status(200).json({
      message: 'Cart updated successfully',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal error' })
  }
}

exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user.userId

    let myCart = await Cart.findOne({ user_id: userId })

    if (!myCart) {
      myCart = await Cart.create({ user_id: userId })
    }

    const { product_id } = req.body;

    const existingProduct = myCart.products.find(item => item.product_id === product_id);

    if (existingProduct) {
      myCart.products = myCart.products.filter(item => item.product_id !== product_id);
      myCart.total -= existingProduct.quantity;
    } else {
      return res.status(400).json({ error: 'Product not found in cart' });
    }

    await myCart.save();

    return res.status(200).json({
      message: 'Item removed successfully',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal error' })
  }
}
