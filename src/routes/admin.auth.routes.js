const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/admin.auth.controller');

const authMiddleware = require('../middlewares/authMiddleware');    
const authorizeRoles = require('../middlewares/authRolesMiddleware');

router.post('/login', adminAuthController.login);
router.post('/manager/add', 
    authMiddleware,
    authorizeRoles(['ADMIN']),
    adminAuthController.createManager
);
router.post('/refresh-token', adminAuthController.refreshToken);
router.post('/verify-token', 
    authMiddleware,
    adminAuthController.verifyToken);
router.post('/logout', adminAuthController.logout);

module.exports = router;