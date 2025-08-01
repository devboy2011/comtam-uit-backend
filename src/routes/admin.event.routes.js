const express = require('express');
const router = express.Router();
const adminEventController = require('../controllers/admin.event.controller');

const authMiddleware = require('../middlewares/authMiddleware');    
const authorizeRoles = require('../middlewares/authRolesMiddleware');

router.post('/new', 
    authMiddleware,
    authorizeRoles(['MANAGER']),
    adminEventController.addEvent);
    
router.delete('/id/:id', 
    authMiddleware,
    authorizeRoles(['MANAGER']),
    adminEventController.deleteEvent);
    
router.put('/id/:id',
    authMiddleware,
    authorizeRoles(['MANAGER']),
    adminEventController.updateEventById);
    
router.get('/id/:id',
    authMiddleware,
    authorizeRoles(['MANAGER']),
    adminEventController.getEventById);

router.get('/slug/:slug',
    authMiddleware,
    authorizeRoles(['MANAGER']),
    adminEventController.getEventBySlug);

router.get('/all',
    authMiddleware,
    authorizeRoles(['MANAGER']),
    adminEventController.getAllEvents);

module.exports = router;