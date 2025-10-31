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

router.get('/orders',  
    authMiddleware,
    authorizeRoles(['CUSTOMER']),
    orderController.getMyOrders
)

module.exports = router;