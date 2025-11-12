const express = require('express');
const router = express.Router();

// const userController = require('../controllers/user1.controller')
const cartController = require('../controllers/cart.controller');
const orderController = require('../controllers/order.controller');
const deliverController = require('../controllers/deliver.controller');
const userController = require('../controllers/user1.controller');

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

router.get('/delivery',
    authMiddleware,
    authorizeRoles(['CUSTOMER']),
    deliverController.getAllDelivery
)

router.post('/delivery',
    authMiddleware,
    authorizeRoles(['CUSTOMER']),
    deliverController.createDelivery
)

router.delete('/delivery/:id',
    authMiddleware,
    authorizeRoles(['CUSTOMER']),
    deliverController.deleteDelivery
)

router.put('/delivery/:id',
    authMiddleware,
    authorizeRoles(['CUSTOMER']),
    deliverController.updateDelivery
)

router.put('/delivery/set-default/:id',
    authMiddleware,
    authorizeRoles(['CUSTOMER']),
    deliverController.setDefaultDelivery
)

router.get('/orders',  
    authMiddleware,
    authorizeRoles(['CUSTOMER']),
    orderController.getMyOrders
)

router.get('/order/:id',
    authMiddleware,
    authorizeRoles(['CUSTOMER']),
    orderController.getOrderById
)

router.post('/order',
    authMiddleware,
    authorizeRoles(['CUSTOMER']),
    orderController.createOrder
)

router.get('/profile',
    authMiddleware,
    authorizeRoles(['CUSTOMER']),
    userController.getProfile
)

router.put('/profile',
    authMiddleware,
    authorizeRoles(['CUSTOMER']),
    userController.updateProfile
)

module.exports = router;