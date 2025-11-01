const express = require('express');
const router = express.Router();

// const userController = require('../controllers/user1.controller')
const cartController = require('../controllers/cart.controller');
const orderController = require('../controllers/order.controller');

const authMiddleware = require('../middlewares/authMiddleware');    
const authorizeRoles = require('../middlewares/authRolesMiddleware');

router.get('/my-cart',  
    authMiddleware,
    authorizeRoles(['CUSTOMER']),
    cartController.getMyCart
)

router.post('/add-to-cart',
    authMiddleware,
    authorizeRoles(['CUSTOMER']),
    cartController.addToCart
)

router.put('/update-cart-item',
    authMiddleware,
    authorizeRoles(['CUSTOMER']),
    cartController.updateCartItem
)

router.delete('/remove-cart-item',
    authMiddleware,
    authorizeRoles(['CUSTOMER']),
    cartController.removeCartItem
)

router.get('/orders',  
    authMiddleware,
    authorizeRoles(['CUSTOMER']),
    orderController.getMyOrders
)

module.exports = router;